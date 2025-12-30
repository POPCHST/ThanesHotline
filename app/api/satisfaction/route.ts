/**
 * @swagger
 * /api/satisfaction:
 *   post:
 *     summary: Submit ticket satisfaction score
 *     tags:
 *       - Rate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - score
 *             properties:
 *               token:
 *                 type: string
 *                 example: c8f9f7b4-0b4a-4e61-a45c-9cbb0c1e9c31
 *                 description: satisfaction token ที่ได้จากการปิด ticket
 *
 *               score:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *                 description: คะแนนความพึงพอใจ (1 = แย่, 5 = ดีมาก)
 *
 *               comment:
 *                 type: string
 *                 nullable: true
 *                 example: บริการดีมาก แก้ไขเร็ว
 *
 *     responses:
 *       200:
 *         description: Satisfaction submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: satisfaction submitted successfully
 *
 *       400:
 *         description: Invalid or expired token
 *
 *       409:
 *         description: Score already submitted
 *
 *       500:
 *         description: Submit satisfaction failed
 */

import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, score, comment } = await req.json();
  // ===============================
  // validation
  // ===============================
  if (!token || !score || score < 1 || score > 5) {
    return NextResponse.json({ message: "invalid input" }, { status: 400 });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // ===============================
    // lock satisfaction row
    // ===============================
    const [rows]: any = await conn.execute(
      `
      SELECT satisfaction_id, score, expired_at
      FROM ticket_satisfaction
      WHERE satisfaction_token = ?
      FOR UPDATE
      `,
      [token]
    );

    if (rows.length === 0) {
      await conn.rollback();
      return NextResponse.json({ message: "invalid token" }, { status: 400 });
    }

    const row = rows[0];

    // ===============================
    // already rated
    // ===============================
    if (row.score !== null) {
      await conn.rollback();
      return NextResponse.json({ message: "already rated" }, { status: 409 });
    }

    // ===============================
    // token expired
    // ===============================
    if (new Date(row.expired_at) < new Date()) {
      await conn.rollback();
      return NextResponse.json({ message: "token expired" }, { status: 400 });
    }

    // ===============================
    // update score
    // ===============================
    await conn.execute(
      `
      UPDATE ticket_satisfaction
      SET
        score = ?,
        comment = ?,
        rated_at = NOW()
      WHERE satisfaction_token = ?
      `,
      [score, comment ?? null, token]
    );

    await conn.commit();

    return NextResponse.json({
      message: "satisfaction submitted successfully",
    });
  } catch (err) {
    await conn.rollback();
    console.error("SATISFACTION ERROR:", err);

    return NextResponse.json(
      { message: "submit failed", error: String(err) },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
