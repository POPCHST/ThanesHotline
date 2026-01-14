import pool from "@/lib/db";

/**
 * @swagger
 * /api/ticket-update:
 *   put:
 *     summary: Update ticket, customer, device, service and resolution
 *     tags:
 *       - Ticket
 */

export async function PUT(req: Request) {
  const conn = await pool.getConnection();
  let txStarted = false;

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
      priority_code,
      impact_level,
      urgency_level,
      department_id,
      assigned_user_name,
      status_code,

      // service / resolution
      service,
      resolution_text,

      // audit
      updated_by,
      updated_at,
    } = body;

    // ===============================
    // validation
    // ===============================
    if (!ticket_no || !updated_by) {
      return Response.json(
        { message: "missing required fields" },
        { status: 400 }
      );
    }

    // ===============================
    // transaction
    // ===============================
    await conn.beginTransaction();
    txStarted = true;

    // ===============================
    // find ticket (ใช้ DB เป็น source of truth)
    // ===============================
    const [ticketRows]: any = await conn.execute(
      `
      SELECT
        ticket_id,
        customer_id,
        device_id,
        is_service_case
      FROM tickets
      WHERE ticket_no = ?
      `,
      [ticket_no]
    );

    if (!ticketRows.length) {
      throw new Error("TICKET_NOT_FOUND");
    }

    const { ticket_id, customer_id, device_id, is_service_case } =
      ticketRows[0];

    // ===============================
    // update customer
    // ===============================
    if (
      customer_name !== undefined ||
      customer_ward !== undefined ||
      contact_name !== undefined ||
      contact_phone !== undefined
    ) {
      await conn.execute(
        `
        UPDATE m_customers
        SET
          customer_name = COALESCE(?, customer_name),
          customer_ward = COALESCE(?, customer_ward),
          contact_name  = COALESCE(?, contact_name),
          contact_phone = COALESCE(?, contact_phone),
          lastmodify    = NOW()
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
    }

    // ===============================
    // update device
    // ===============================
    if (device_name !== undefined) {
      await conn.execute(
        `
        UPDATE m_devices
        SET
          device_name = COALESCE(?, device_name),
          lastmodify  = NOW()
        WHERE device_id = ?
        `,
        [device_name ?? null, device_id]
      );
    }

    // ===============================
    // update ticket
    // ===============================
    await conn.execute(
      `
      UPDATE tickets
      SET
        issue_type_id      = COALESCE(?, issue_type_id),
        tag_id             = COALESCE(?, tag_id),
        issue_title        = COALESCE(?, issue_title),
        issue_detail       = COALESCE(?, issue_detail),
        priority_code      = COALESCE(?, priority_code),
        impact_level       = COALESCE(?, impact_level),
        urgency_level      = COALESCE(?, urgency_level),
        department_id      = COALESCE(?, department_id),
        assigned_user_name = COALESCE(?, assigned_user_name),
        status_code        = COALESCE(?, status_code),
        updated_at         = COALESCE(?, NOW()),
        updated_by         = ?
      WHERE ticket_id = ?
      `,
      [
        issue_type_id ?? null,
        tag_id ?? null,
        issue_title ?? null,
        issue_detail ?? null,
        priority_code ?? null,
        impact_level ?? null,
        urgency_level ?? null,
        department_id ?? null,
        assigned_user_name ?? null,
        status_code ?? null,
        updated_at ?? null,
        updated_by,
        ticket_id,
      ]
    );

    // ===============================
    // service (เฉพาะ service case เท่านั้น)
    // ===============================
    if (is_service_case === 1 && service) {
      const {
        service_types,
        work_order_no,
        cost_estimate,
        serial_before,
        serial_after,
        replaced_parts,
        service_note,
      } = service;

      await conn.execute(
        `
        INSERT INTO ticket_service (
          ticket_id,
          service_types,
          work_order_no,
          cost_estimate,
          serial_before,
          serial_after,
          replaced_parts,
          service_note
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          service_types  = VALUES(service_types),
          work_order_no  = VALUES(work_order_no),
          cost_estimate  = VALUES(cost_estimate),
          serial_before  = VALUES(serial_before),
          serial_after   = VALUES(serial_after),
          replaced_parts = VALUES(replaced_parts),
          service_note   = VALUES(service_note)
        `,
        [
          ticket_id,
          Array.isArray(service_types) ? service_types.join(",") : null,
          work_order_no ?? null,
          cost_estimate ?? null,
          serial_before ?? null,
          serial_after ?? null,
          replaced_parts ?? null,
          service_note ?? null,
        ]
      );
    }

    // ===============================
    // ถ้าไม่ใช่ service case → ล้าง service ทิ้ง
    // ===============================
    if (is_service_case === 0) {
      await conn.execute(`DELETE FROM ticket_service WHERE ticket_id = ?`, [
        ticket_id,
      ]);
    }

    // ===============================
    // resolution (UPDATE / UPSERT)
    // ===============================
    if (resolution_text && resolution_text.trim() !== "") {
      await conn.execute(
        `
        INSERT INTO ticket_resolution (
          ticket_id,
          resolution_text,
          resolution_by,
          resolution_at
        )
        VALUES (?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          resolution_text = VALUES(resolution_text),
          resolution_by   = VALUES(resolution_by),
          resolution_at   = NOW()
        `,
        [ticket_id, resolution_text, updated_by]
      );
    }

    await conn.commit();

    return Response.json({
      message: "ticket updated successfully",
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

    console.error("UPDATE TICKET ERROR:", err);

    return Response.json(
      { message: "update ticket failed", error: String(err) },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
