/**
 * @swagger
 * /api/tickets/{ticketId}/attachments:
 *   post:
 *     summary: บันทึกไฟล์แนบของ Ticket (หลังอัปโหลดไฟล์แล้ว)
 *     tags:
 *       - Ticket Attachments
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               file_path:
 *                 type: string
 *                 example: /uploads/tickets/1/abc.jpg
 *               uploaded_by:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Saved
 */

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

/* ===================== POST ===================== */
export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } },
) {
  const ticketId = Number(params.ticketId);
  if (isNaN(ticketId)) {
    return NextResponse.json({ message: "Invalid ticketId" }, { status: 400 });
  }

  const { file_path, uploaded_by } = await req.json();

  if (!file_path) {
    return NextResponse.json(
      { message: "file_path is required" },
      { status: 400 },
    );
  }

  const [result]: any = await db.query(
    `
    INSERT INTO ticket_attachments
      (ticket_id, file_path, uploaded_by)
    VALUES (?, ?, ?)
    `,
    [ticketId, file_path, uploaded_by],
  );

  return NextResponse.json(
    {
      attachment_id: result.insertId,
      file_path,
    },
    { status: 201 },
  );
}

/* ===================== GET ===================== */
export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } },
) {
  const ticketId = Number(params.ticketId);

  const [rows] = await db.query(
    `
    SELECT
      attachment_id,
      file_name,
      file_path,
      uploaded_at
    FROM ticket_attachments
    WHERE ticket_id = ?
    ORDER BY uploaded_at
    `,
    [ticketId],
  );

  return NextResponse.json(rows);
}
