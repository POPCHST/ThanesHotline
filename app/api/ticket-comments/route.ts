
/**
 * @swagger
 * /api/ticketLogs:
 *   post:
 *     summary: Insert ticket action log
 *     tags:
 *       - Ticket Logs
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - ticket_id
 *               - action_type
 *             properties:
 *               ticket_id:
 *                 type: integer
 *                 example: 1
 *               action_type:
 *                 type: string
 *               old_value:
 *                 type: string
 *               new_value:
 *                 type: string
 *               action_by:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Created
 */

import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const ticket_id = Number(formData.get("ticket_id") ?? 0);
    const action_type = formData.get("action_type") as string;
    const old_value = formData.get("old_value") as string | null;
    const new_value = formData.get("new_value") as string | null;
    const action_by = Number(formData.get("action_by") ?? 0);

    if (!ticket_id || !action_type) {
      return Response.json(
        { message: "ticket_id and action_type are required" },
        { status: 400 }
      );
    }

    await pool.query(
      `
      INSERT INTO ticket_logs (
        ticket_id,
        action_type,
        old_value,
        new_value,
        action_by,
        action_at
      ) VALUES (
        ?, ?, ?, ?, ?, NOW()
      )
      `,
      [ticket_id, action_type, old_value, new_value, action_by || null]
    );

    return Response.json(
      { message: "Ticket log created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Create ticket log error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
