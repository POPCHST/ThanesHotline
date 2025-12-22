/**
 * @swagger
 * /api/ticket-forwards:
 *   post:
 *     summary: Forward ticket to another department
 *     tags:
 *       - Forward
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - ticket_id
 *               - from_department_id
 *               - to_department_id
 *             properties:
 *               ticket_id:
 *                 type: integer
 *                 example: 1
 *               from_department_id:
 *                 type: integer
 *               to_department_id:
 *                 type: integer
 *               reason:
 *                 type: string
 *                 example: ส่งต่อให้ IT ตรวจสอบระบบ
 *               forward_by:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Created
 */

import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const ticket_id = Number(formData.get("ticket_id") ?? 0);
    const from_department_id = Number(formData.get("from_department_id") ?? 0);
    const to_department_id = Number(formData.get("to_department_id") ?? 0);
    const reason = formData.get("reason") as string | null;
    const forward_by = Number(formData.get("forward_by") ?? 0); // TODO: from token

    // ===== validation =====
    if (!ticket_id || !from_department_id || !to_department_id) {
      return Response.json(
        {
          message:
            "ticket_id, from_department_id, to_department_id are required",
        },
        { status: 400 }
      );
    }

    // ===== insert forward =====
    await pool.query(
      `
      INSERT INTO ticket_forward_history (
        ticket_id,
        from_department_id,
        to_department_id,
        reason,
        forward_by,
        forward_at
      ) VALUES (
        ?, ?, ?, ?, ?, NOW()
      )
      `,
      [
        ticket_id,
        from_department_id,
        to_department_id,
        reason,
        forward_by || null,
      ]
    );

    return Response.json(
      { message: "Ticket forwarded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forward ticket error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
