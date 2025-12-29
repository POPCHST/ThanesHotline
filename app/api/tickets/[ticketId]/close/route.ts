import crypto from "crypto";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { ticketId: string } }
) {
  const conn = await pool.getConnection();
  const ticket_id = Number(params.ticketId);

  if (!ticket_id) {
    return NextResponse.json({ message: "invalid ticket id" }, { status: 400 });
  }

  try {
    await conn.beginTransaction();

    // ===============================
    // 1. ปิด ticket
    // ===============================
    const [closeResult]: any = await conn.execute(
      `
      UPDATE tickets
      SET
        status_code = 'closed',
        closed_at = NOW()
      WHERE ticket_id = ?
        AND status_code <> 'closed'
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
    // 2. เช็คว่ามี satisfaction token แล้วหรือยัง
    // ===============================
    const [rows]: any = await conn.execute(
      `
      SELECT satisfaction_id
      FROM ticket_satisfaction
      WHERE ticket_id = ?
      `,
      [ticket_id]
    );

    let token: string | null = null;

    // ===============================
    // 3. สร้าง satisfaction token (ครั้งเดียว)
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

    await conn.commit();

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
