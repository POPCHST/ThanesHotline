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
 */
import crypto from "crypto";
import pool from "@/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendSatisfactionSms } from "@/services/sms";

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  const ticket_id = Number(params.ticketId);

  if (!ticket_id || Number.isNaN(ticket_id)) {
    return NextResponse.json({ message: "invalid ticket id" }, { status: 400 });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. close ticket
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

    // 2. lock satisfaction
    const [rows]: any = await conn.execute(
      `
      SELECT satisfaction_token
      FROM ticket_satisfaction
      WHERE ticket_id = ?
      FOR UPDATE
      `,
      [ticket_id]
    );

    let token: string | null = null;

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
    } else {
      token = rows[0].satisfaction_token;
    }

    // 3. get phone
    const [[ticket]]: any = await conn.execute(
      `
      SELECT c.contact_phone
      FROM tickets t
      JOIN m_customers c ON c.customer_id = t.customer_id
      WHERE t.ticket_id = ?
      `,
      [ticket_id]
    );

    await conn.commit();

    // 🔥 DEBUG สำคัญมาก
    console.log("SATISFACTION SMS DATA:", {
      ticket_id,
      phone: ticket?.contact_phone,
      token,
    });

    // 4. send SMS
    if (token && ticket?.contact_phone) {
      const surveyUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/satisfaction?token=${token}`;

      await sendSatisfactionSms({
        phone: ticket.contact_phone.trim(),
        surveyUrl,
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
