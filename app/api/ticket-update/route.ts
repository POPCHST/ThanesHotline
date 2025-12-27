import pool from "@/lib/db";

/**
 * @swagger
 * /api/ticket-update:
 *   put:
 *     summary: Update ticket, customer and device
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
 *               - issue_title
 *               - issue_detail
 *               - department_id
 *               - updated_by
 *             properties:
 *               ticket_no:
 *                 type: string
 *               customer_name:
 *                 type: string
 *               customer_ward:
 *                 type: string
 *               contact_name:
 *                 type: string
 *               contact_phone:
 *                 type: string
 *               device_name:
 *                 type: string
 *               issue_type_id:
 *                 type: integer
 *                 nullable: true
 *               tag_id:
 *                 type: integer
 *                 nullable: true
 *               issue_title:
 *                 type: string
 *               issue_detail:
 *                 type: string
 *               department_id:
 *                 type: integer
 *               assigned_user_name:
 *                 type: string
 *               status_code:
 *                 type: string
 *               updated_by:
 *                 type: integer
 *               updated_at:
 *                 type: string
 */

export async function PUT(req: Request) {
  const conn = await pool.getConnection();
  let isTransactionStarted = false; // 🔑 จุดสำคัญ

  try {
    const body = await req.json();

    const {
      ticket_no,

      // customer
      customer_name,
      customer_ward,
      contact_name,
      contact_phone,

      // device
      device_name,

      // ticket
      issue_type_id,
      tag_id,
      issue_title,
      issue_detail,
      department_id,
      assigned_user_name,
      status_code,

      // audit
      updated_by,
      updated_at,
    } = body;

    // ===============================
    // validation
    // ===============================
    if (
      !ticket_no ||
      !issue_title ||
      !issue_detail ||
      !department_id ||
      !updated_by
    ) {
      return Response.json(
        { message: "missing required fields" },
        { status: 400 }
      );
    }

    // ===============================
    // start transaction
    // ===============================
    await conn.beginTransaction();
    isTransactionStarted = true;

    // ===============================
    // find ticket
    // ===============================
    const [ticketRows]: any = await conn.execute(
      `
      SELECT ticket_id, customer_id, device_id
      FROM tickets
      WHERE ticket_no = ?
      `,
      [ticket_no]
    );

    if (!ticketRows.length) {
      throw new Error("TICKET_NOT_FOUND");
    }

    const { ticket_id, customer_id, device_id } = ticketRows[0];

    // ===============================
    // update customer
    // ===============================
    await conn.execute(
      `
      UPDATE m_customers
      SET
        customer_name = ?,
        customer_ward = ?,
        contact_name = ?,
        contact_phone = ?,
        lastmodify = now()
      WHERE customer_id = ?
      `,
      [
        customer_name ?? null,
        customer_ward ?? null,
        contact_name ?? null,
        contact_phone ?? null,
        customer_id,
      ]
    );

    // ===============================
    // update device
    // ===============================
    await conn.execute(
      `
      UPDATE m_devices
      SET device_name = ?,
      lastmodify = now()
      WHERE device_id = ?
      `,
      [device_name ?? null, device_id]
    );

    // ===============================
    // update ticket
    // ===============================
    await conn.execute(
      `
      UPDATE tickets
      SET
        issue_type_id = ?,
        tag_id = ?,
        issue_title = ?,
        issue_detail = ?,
        department_id = ?,
        assigned_user_name = ?,
        status_code = ?,
        updated_at = COALESCE(?, NOW()),
        updated_by = ?
      WHERE ticket_id = ?
      `,
      [
        issue_type_id ?? null,
        tag_id ?? null,
        issue_title,
        issue_detail,
        department_id,
        assigned_user_name ?? "",
        status_code ?? "open",
        updated_at ?? null,
        updated_by,
        ticket_id,
      ]
    );

    await conn.commit();

    return Response.json({
      message: "ticket updated successfully",
      ticket_no,
    });
  } catch (err: any) {
    // rollback เฉพาะตอนที่ transaction เริ่มแล้ว
    if (isTransactionStarted) {
      try {
        await conn.rollback();
      } catch (_) {
        // ignore rollback error
      }
    }

    if (err.message === "TICKET_NOT_FOUND") {
      return Response.json({ message: "ticket not found" }, { status: 404 });
    }

    console.error("UPDATE TICKET ERROR:", err);

    return Response.json(
      { message: "update ticket failed", error: String(err) },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
