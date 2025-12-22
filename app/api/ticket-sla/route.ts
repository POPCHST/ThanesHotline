/**
 * @swagger
 * /api/ticket-sla:
 *   get:
 *     summary: Get ticket SLA by ticket_id
 *     tags:
 *       - SLA
 *     parameters:
 *       - in: query
 *         name: ticket_id
 *         schema:
 *           type: integer
 *         required: true
 *         example: 1
 *     responses:
 *       200:
 *         description: Success
 */

import pool from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticket_id = Number(searchParams.get("ticket_id") ?? 0);

  if (!ticket_id) {
    return Response.json({ message: "ticket_id is required" }, { status: 400 });
  }

  const [rows]: any = await pool.query(
    `
    SELECT
      ticket_id,
      start_time,
      first_response_time,
      resolve_time,
      is_breach
    FROM ticket_sla_tracking
    WHERE ticket_id = ?
    LIMIT 1
    `,
    [ticket_id]
  );

  return Response.json(rows[0] || null);
}

/**
 * @swagger
 * /api/ticket-sla:
 *   post:
 *     summary: Create or update ticket SLA
 *     tags:
 *       - SLA
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - ticket_id
 *             properties:
 *               ticket_id:
 *                 type: integer
 *                 example: 1
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               first_response_time:
 *                 type: string
 *                 format: date-time
 *               resolve_time:
 *                 type: string
 *                 format: date-time
 *               is_breach:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       200:
 *         description: Success
 */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const ticket_id = Number(formData.get("ticket_id") ?? 0);
    const start_time = formData.get("start_time") as string | null;
    const first_response_time = formData.get("first_response_time") as
      | string
      | null;
    const resolve_time = formData.get("resolve_time") as string | null;
    const is_breach = Number(formData.get("is_breach") ?? 0);

    if (!ticket_id) {
      return Response.json(
        { message: "ticket_id is required" },
        { status: 400 }
      );
    }

    /**
     * ใช้ ON DUPLICATE KEY UPDATE
     * (ticket_id เป็น PK)
     */
    await pool.query(
      `
      INSERT INTO ticket_sla_tracking (
        ticket_id,
        start_time,
        first_response_time,
        resolve_time,
        is_breach
      ) VALUES (
        ?, ?, ?, ?, ?
      )
      ON DUPLICATE KEY UPDATE
        start_time = VALUES(start_time),
        first_response_time = VALUES(first_response_time),
        resolve_time = VALUES(resolve_time),
        is_breach = VALUES(is_breach)
      `,
      [ticket_id, start_time, first_response_time, resolve_time, is_breach]
    );

    return Response.json(
      { message: "Ticket SLA saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ticket SLA error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
