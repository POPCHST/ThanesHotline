import pool from "@/lib/db";

/**
 * @swagger
 * /api/ticket-update/recovery:
 *   put:
 *     summary: Recover deleted ticket
 *     tags:
 *       - Ticket
 */

export async function PUT(req: Request) {
  const conn = await pool.getConnection();
  let txStarted = false;

  try {
    const body = await req.json();
    const { ticket_no, updated_by } = body;

    // ===============================
    // validation
    // ===============================
    if (!ticket_no || !updated_by) {
      return Response.json(
        { message: "missing required fields" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();
    txStarted = true;

    // ===============================
    // check ticket exists
    // ===============================
    const [rows]: any = await conn.execute(
      `
      SELECT ticket_id
      FROM tickets
      WHERE ticket_no = ?
      `,
      [ticket_no]
    );

    if (!rows.length) {
      throw new Error("TICKET_NOT_FOUND");
    }

    const { ticket_id } = rows[0];

    // ===============================
    // recovery ticket
    // ===============================
    await conn.execute(
      `
      UPDATE tickets
      SET
        is_deleted = 0,
        deleted_at = NULL,
        deleted_by = NULL,
        updated_at = NOW(),
        updated_by = ?
      WHERE ticket_id = ?
      `,
      [updated_by, ticket_id]
    );

    await conn.commit();

    return Response.json({
      message: "ticket recovered successfully",
      ticket_no,
    });
  } catch (err: any) {
    if (txStarted) {
      try {
        await conn.rollback();
      } catch {}
    }

    if (err.message === "TICKET_NOT_FOUND") {
      return Response.json({ message: "ticket not found" }, { status: 404 });
    }

    console.error("RECOVERY TICKET ERROR:", err);

    return Response.json(
      { message: "recover ticket failed", error: String(err) },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
