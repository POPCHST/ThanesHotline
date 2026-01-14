/**
 * @swagger
 * /api/tickets/{ticketId}/reopen:
 *   put:
 *     summary: Reopen a closed ticket
 *     description: >
 *       Reopen a ticket that has already been closed.
 *       The backend automatically handles all business logic including
 *       validating ticket state, changing status from `close` to `open`,
 *       incrementing reopen count, and resetting closed/resolved timestamps.
 *       The client only needs to trigger this action.
 *     tags:
 *       - Ticket
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ticket ID to reopen
 *         example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - updated_by
 *             properties:
 *               updated_by:
 *                 type: integer
 *                 description: User ID who triggers the reopen action
 *                 example: 5
 *     responses:
 *       200:
 *         description: Ticket reopened successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ticket reopened successfully
 *                 ticket_id:
 *                   type: integer
 *                   example: 123
 *                 reopen_count:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Ticket is not in a closed state or request is invalid
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Reopen ticket failed
 */
import { NextRequest } from "next/server";
import pool from "@/lib/db";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ ticketId: string }> }
) {
  const conn = await pool.getConnection();
  let tx = false;

  try {
    const { ticketId } = await context.params;
    const body = await request.json();
    const { updated_by } = body;

    const ticket_id = Number(ticketId);

    if (!ticket_id || !updated_by) {
      return Response.json(
        { message: "missing required fields" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();
    tx = true;

    const [rows]: any = await conn.execute(
      `
      SELECT status_code, reopen_count
      FROM tickets
      WHERE ticket_id = ?
      FOR UPDATE
      `,
      [ticket_id]
    );

    if (!rows.length) {
      throw new Error("TICKET_NOT_FOUND");
    }

    if (rows[0].status_code !== "close") {
      return Response.json(
        { message: "ticket is not closed" },
        { status: 400 }
      );
    }

    const [result]: any = await conn.execute(
      `
      UPDATE tickets
      SET
        status_code   = 'open',
        is_reopen     = 1,
        reopen_count  = reopen_count + 1,
        resolved_at   = NULL,
        closed_at     = NULL,
        updated_by    = ?,
        updated_at    = NOW()
      WHERE ticket_id = ?
        AND status_code = 'close'
        AND is_deleted = 0
      `,
      [updated_by, ticket_id]
    );

    if (result.affectedRows === 0) {
      throw new Error("REOPEN_FAILED");
    }

    await conn.commit();

    return Response.json({
      message: "ticket reopened successfully",
      ticket_id,
      reopen_count: rows[0].reopen_count + 1,
    });
  } catch (err: any) {
    if (tx) {
      try {
        await conn.rollback();
      } catch {}
    }

    if (err.message === "TICKET_NOT_FOUND") {
      return Response.json({ message: "ticket not found" }, { status: 404 });
    }

    console.error("REOPEN TICKET ERROR:", err);

    return Response.json(
      { message: "reopen ticket failed", error: String(err) },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
