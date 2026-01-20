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
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import fs from "fs/promises";
import path from "path";

/* ===================== POST ===================== */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ ticketId: string }> },
) {
  const { ticketId } = await context.params;
  const id = Number(ticketId);

  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid ticketId" }, { status: 400 });
  }

  const formData = await req.formData();
  const files = formData.getAll("file") as File[];
  const uploadedBy = Number(formData.get("uploaded_by") || null);

  if (!files.length) {
    return NextResponse.json({ message: "File is required" }, { status: 400 });
  }

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "tickets",
    id.toString(),
  );

  await fs.mkdir(uploadDir, { recursive: true });

  const inserted: any[] = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    const dbFilePath = `/uploads/tickets/${id}/${fileName}`;

    const [result]: any = await db.query(
      `
      INSERT INTO ticket_attachments
        (ticket_id, file_name, file_path, uploaded_by)
      VALUES (?, ?, ?, ?)
      `,
      [id, file.name, dbFilePath, uploadedBy],
    );

    inserted.push({
      attachment_id: result.insertId,
      file_name: file.name,
      file_path: dbFilePath,
    });
  }

  return NextResponse.json(inserted, { status: 201 });
}

/* ===================== GET ===================== */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ ticketId: string }> },
) {
  const { ticketId } = await context.params;
  const id = Number(ticketId);

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
    [id],
  );

  return NextResponse.json(rows);
}
