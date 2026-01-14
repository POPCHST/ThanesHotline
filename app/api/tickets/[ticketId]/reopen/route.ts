/**
 * @swagger
 * /api/tickets/{ticket_no}/reopen:
 *   put:
 *     summary: Reopen a closed ticket
 *     description: >
 *       Reopen a ticket that is already closed.
 *       The backend will automatically handle all business logic:
 *       validating ticket state, changing status from `close` to `open`,
 *       marking the ticket as reopened, incrementing reopen count,
 *       and resetting closed/resolved timestamps.
 *
 *       The client only needs to trigger this action.
 *     tags:
 *       - Ticket
 *     parameters:
 *       - in: path
 *         name: ticket_no
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket number to reopen
 *         example: TCK-20260101-0001
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
 *                 ticket_no:
 *                   type: string
 *                   example: TCK-20260101-0001
 *                 reopen_count:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Ticket is not in a closed state or request is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ticket is not closed
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ticket not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: reopen ticket failed
 */

import pool from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { ticket_no: string } }
) {
  const conn = await pool.getConnection();
  let tx = false;

  try {
    const { ticket_no } = params;
    const body = await req.json();
    const { updated_by } = body;

    if (!ticket_no || !updated_by) {
      return Response.json(
        { message: "missing required fields" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();
    tx = true;

    // เช็กสถานะก่อน
    const [rows]: any = await conn.execute(
      `
      SELECT status_code, reopen_count
      FROM tickets
      WHERE ticket_no = ?
        AND is_deleted = 0
      `,
      [ticket_no]
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

    // Reopen
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
      WHERE ticket_no = ?
        AND status_code = 'close'
        AND is_deleted = 0
      `,
      [updated_by, ticket_no]
    );

    if (result.affectedRows === 0) {
      throw new Error("REOPEN_FAILED");
    }

    await conn.commit();

    return Response.json({
      message: "ticket reopened successfully",
      ticket_no,
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
