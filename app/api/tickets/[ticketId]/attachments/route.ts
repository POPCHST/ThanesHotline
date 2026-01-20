import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import fs from "fs/promises";
import path from "path";

/**
 * @swagger
 * /api/tickets/{ticketId}/attachments:
 *   post:
 *     summary: อัปโหลดไฟล์แนบของ Ticket
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               uploaded_by:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Upload สำเร็จ
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } },
) {
  const ticketId = Number(params.ticketId);
  if (isNaN(ticketId)) {
    return NextResponse.json({ message: "Invalid ticketId" }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const uploadedBy = Number(formData.get("uploaded_by") || null);

  if (!file) {
    return NextResponse.json({ message: "File is required" }, { status: 400 });
  }

  // สร้างโฟลเดอร์
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "tickets",
    ticketId.toString(),
  );

  await fs.mkdir(uploadDir, { recursive: true });

  // ตั้งชื่อไฟล์
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  // เขียนไฟล์ลง server
  await fs.writeFile(filePath, buffer);

  // path ที่เก็บลง DB (ใช้กับ frontend)
  const dbFilePath = `/uploads/tickets/${ticketId}/${fileName}`;

  // INSERT DB
  const [result]: any = await db.query(
    `
    INSERT INTO ticket_attachments
      (ticket_id, file_name, file_path, uploaded_by)
    VALUES (?, ?, ?, ?)
    `,
    [ticketId, file.name, dbFilePath, uploadedBy],
  );

  return NextResponse.json(
    {
      attachment_id: result.insertId,
      file_name: file.name,
      file_path: dbFilePath,
    },
    { status: 201 },
  );
}

/**
 * @swagger
 * /api/tickets/{ticketId}/attachments:
 *   get:
 *     summary: ดึงไฟล์แนบของ Ticket
 *     tags:
 *       - Ticket Attachments
 */
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
