/**
 * @swagger
 * /api/ticket-delete:
 *   put:
 *     summary: Soft delete ticket (update only is_deleted, deleted_at, deleted_by)
 *     tags:
 *       - Ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticket_no
 *               - deleted_by
 *             properties:
 *               ticket_no:
 *                 type: string
 *                 example: TCK-1766819708852
 *               deleted_by:
 *                 type: integer
 *                 example: 12
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Delete ticket failed
 */
import pool from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const { ticket_no, deleted_by } = await req.json();

    // ===============================
    // validation
    // ===============================
    if (!ticket_no || !deleted_by) {
      return Response.json(
        { message: "ticket_no and deleted_by are required" },
        { status: 400 }
      );
    }

    // ===============================
    // soft delete (update only 3 fields)
    // ===============================
    const [result]: any = await pool.execute(
      `
      UPDATE tickets
      SET is_deleted = 1,
          deleted_at = NOW(),
          deleted_by = ?
      WHERE ticket_no = ?`,
      [deleted_by, ticket_no]
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { message: "ticket not found or already deleted" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "ticket deleted successfully",
      ticket_no,
    });
  } catch (err) {
    console.error("DELETE TICKET ERROR:", err);
    return Response.json(
      { message: "delete ticket failed", error: String(err) },
      { status: 500 }
    );
  }
}
