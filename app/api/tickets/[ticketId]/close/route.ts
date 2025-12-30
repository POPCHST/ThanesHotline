/**
 * @swagger
 * /api/tickets/{ticketId}/close:
 *   post:
 *     summary: Close ticket and generate satisfaction token
 *     tags:
 *       - Rate
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 123
 *         description: ID ของ ticket ที่ต้องการปิด
 *
 *     responses:
 *       200:
 *         description: Ticket closed successfully and satisfaction token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ticket closed successfully
 *
 *                 ticket_id:
 *                   type: integer
 *                   example: 123
 *
 *                 satisfaction_token:
 *                   type: string
 *                   nullable: true
 *                   example: c8f9f7b4-0b4a-4e61-a45c-9cbb0c1e9c31
 *
 *                 survey_url:
 *                   type: string
 *                   nullable: true
 *                   example: https://frontend.example.com/satisfaction?token=c8f9f7b4-0b4a-4e61-a45c-9cbb0c1e9c31
 *
 *       400:
 *         description: Invalid ticket id
 *
 *       409:
 *         description: Ticket already closed or not found
 *
 *       500:
 *         description: Close ticket failed
 */ import crypto from "crypto";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendSatisfactionSms } from "@/services/sms";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ ticketId: string }> }
) {
  const { ticketId } = await context.params;
  const ticket_id = Number(ticketId);

  if (!ticket_id) {
    return NextResponse.json({ message: "invalid ticket id" }, { status: 400 });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // ===============================
    // 1. ปิด ticket
    // ===============================
    const [closeResult]: any = await conn.execute(
      `
      UPDATE tickets
      SET status_code = 'close',
          closed_at = NOW()
      WHERE ticket_id = ?
        AND status_code <> 'close'
      `,
      [ticket_id]
    );

    if (closeResult.affectedRows === 0) {
      await conn.rollback();
      return NextResponse.json(
        { message: "ticket already closed or not found" },
        { status: 409 }
      );
    }

    // ===============================
    // 2. lock + check satisfaction
    // ===============================
    const [rows]: any = await conn.execute(
      `
      SELECT satisfaction_id
      FROM ticket_satisfaction
      WHERE ticket_id = ?
      FOR UPDATE
      `,
      [ticket_id]
    );

    let token: string | null = null;

    // ===============================
    // 3. create token (once)
    // ===============================
    if (rows.length === 0) {
      token = crypto.randomUUID();

      await conn.execute(
        `
        INSERT INTO ticket_satisfaction (
          ticket_id,
          satisfaction_token,
          expired_at
        ) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))
        `,
        [ticket_id, token]
      );
    }

    // ===============================
    // 4. ดึงเบอร์ลูกค้า
    // ===============================
    const [[ticket]]: any = await conn.execute(
      `
      SELECT c.contact_phone
      FROM tickets t
      JOIN customer c ON c.customer_id = t.customer_id
      WHERE t.ticket_id = ?
      `,
      [ticket_id]
    );

    // ===============================
    // 5. commit ก่อน
    // ===============================
    await conn.commit();

    // ===============================
    // 6. ส่ง SMS (หลัง commit เท่านั้น)
    // ===============================
    if (token && ticket?.contact_phone) {
      const surveyUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/satisfaction?token=${token}`;

      sendSatisfactionSms({
        phone: ticket.contact_phone,
        surveyUrl,
      }).catch((err) => {
        console.error("SEND SATISFACTION SMS ERROR:", err);
      });
    }

    return NextResponse.json({
      message: "ticket closed successfully",
      ticket_id,
      satisfaction_token: token,
      survey_url: token
        ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}/satisfaction?token=${token}`
        : null,
    });
  } catch (err) {
    await conn.rollback();
    console.error("CLOSE TICKET ERROR:", err);

    return NextResponse.json(
      { message: "close ticket failed", error: String(err) },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
