/**
 * @swagger
 * /api/transit-tickets:
 *   post:
 *     summary: Create customer, device and ticket (IT or Service) in one transaction
 *     tags:
 *       - Ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_name
 *               - customer_ward
 *               - contact_name
 *               - contact_phone
 *               - device_name
 *               - issue_title
 *               - issue_detail
 *               - department_id
 *               - created_by
 *             properties:
 *               customer_name:
 *                 type: string
 *                 example: ห้องยา ICU
 *
 *               customer_ward:
 *                 type: string
 *                 example: ICU
 *
 *               contact_name:
 *                 type: string
 *                 example: พยาบาลสมศรี
 *
 *               contact_phone:
 *                 type: string
 *                 example: 0812345678
 *
 *               device_name:
 *                 type: string
 *                 example: เครื่องนับยา YUYAMA
 *
 *               issue_type_id:
 *                 type: integer
 *                 example: 3
 *
 *               tag_id:
 *                 type: integer
 *                 example: 4
 *
 *               status_code:
 *                 type: string
 *                 example: open
 *                 description: ถ้าไม่ส่งมา ระบบจะใช้ค่าเริ่มต้น = open
 *
 *               issue_title:
 *                 type: string
 *                 example: เครื่องนับยาไม่ดูดเม็ดยา
 *
 *               issue_detail:
 *                 type: string
 *                 example: เครื่องหยุดทำงานหลังเปิด 5 นาที
 *
 *               priority_code:
 *                 type: string
 *                 example: HIGH
 *
 *               impact_level:
 *                 type: string
 *                 example: HIGH
 *
 *               urgency_level:
 *                 type: string
 *                 example: URGENT
 *
 *               department_id:
 *                 type: integer
 *                 example: 2
 * 
 *              assigned_user_id:
 *                 type: integer
 *                 example: 2
 *
 *               assigned_user_name:
 *                 type: string
 *                 example: user2
 *
 *               created_by:
 *                 type: integer
 *                 example: 1
 *
 *               created_at:
 *                 type: string
 *                 example: "2025-12-26 08:00"
 *                 description: วันที่และเวลาที่ต้องการสร้าง ticket (เวลาไทย YYYY-MM-DD HH:mm)
 *
 *               is_service_case:
 *                 type: integer
 *                 enum: [0, 1]
 *                 example: 0
 *                 description: "0 = IT ปกติ, 1 = Service"
 *
 *               service:
 *                 type: object
 *                 description: ข้อมูลเฉพาะ Service (ใช้เมื่อ is_service_case = 1)
 *                 properties:
 *                   service_types:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["repair", "replace"]
 *
 *                   work_order_no:
 *                     type: string
 *                     example: WO-2025-0001
 *
 *                   cost_estimate:
 *                     type: number
 *                     example: 1500
 *
 *                   serial_before:
 *                     type: string
 *                     example: SN-OLD-1234
 *
 *                   serial_after:
 *                     type: string
 *                     example: SN-NEW-5678
 *
 *                   replaced_parts:
 *                     type: string
 *                     example: Motor, Sensor
 *
 *                   service_note:
 *                     type: string
 *                     example: ติดตั้ง + PM
 *
 *               resolution_text:
 *                 type: string
 *                 example: เปลี่ยน motor และ calibrate เครื่องเรียบร้อย
 *
 *     responses:
 *       200:
 *         description: Created customer, device, ticket, service (optional) and resolution (optional) successfully
 */

import pool from "@/lib/db";

export async function POST(req: Request) {
  const conn = await pool.getConnection();

  try {
    const body = await req.json();
    // console.log("REQUEST BODY:", body);

    // ===============================
    // customer
    // ===============================
    const customer_name = body.customer_name;
    const customer_ward = body.customer_ward;
    const contact_name = body.contact_name;
    const contact_phone = body.contact_phone;

    // ===============================
    // device
    // ===============================
    const device_name = body.device_name;

    // ===============================
    // ticket
    // ===============================
    const issue_title = body.issue_title;
    const issue_detail = body.issue_detail;
    const priority_code = body.priority_code;
    const department_id = Number(body.department_id);
    const assigned_user_id = body.assigned_user_id;
    const assigned_user_name =
      typeof body.assigned_user_name === "string" &&
      body.assigned_user_name.trim() !== ""
        ? body.assigned_user_name
        : "";

    const issue_type_id =
      body.issue_type_id !== undefined ? Number(body.issue_type_id) : null;

    const tag_id = body.tag_id !== undefined ? Number(body.tag_id) : null;

    const status_code =
      typeof body.status_code === "string" && body.status_code.trim() !== ""
        ? body.status_code
        : "open";

    const impact_level = body.impact_level ?? null;
    const urgency_level = body.urgency_level ?? null;

    const created_by = Number(body.created_by);

    const created_at =
      body.created_at && typeof body.created_at === "string"
        ? body.created_at
        : null;

    // ===============================
    // service flag
    // ===============================
    const is_service_case = body.is_service_case === 1 ? 1 : 0;

    // ===============================
    // resolution (optional)
    // ===============================
    const resolution_text =
      typeof body.resolution_text === "string" ? body.resolution_text : null;
    const resolution_by = created_by;

    // ===============================
    // validation
    // ===============================
    if (
      !customer_name ||
      !customer_ward ||
      !contact_name ||
      !contact_phone ||
      !device_name ||
      !issue_title ||
      !issue_detail ||
      !department_id ||
      !created_by
    ) {
      return Response.json(
        { message: "missing required fields" },
        { status: 400 }
      );
    }

    // ===============================
    // transaction
    // ===============================
    await conn.beginTransaction();

    // ===============================
    // INSERT customer
    // ===============================
    const [custResult]: any = await conn.execute(
      `
      INSERT INTO m_customers (
        customer_name,
        customer_ward,
        contact_name,
        contact_phone,
        lastmodify
      ) VALUES (?, ?, ?, ?, NOW())
      `,
      [customer_name, customer_ward, contact_name, contact_phone]
    );

    const customer_id = custResult.insertId;
    if (!customer_id) throw new Error("customer insert failed");

    // ===============================
    // INSERT device
    // ===============================
    const [devResult]: any = await conn.execute(
      `INSERT INTO m_devices (device_name) VALUES (?)`,
      [device_name]
    );

    const device_id = devResult.insertId;
    if (!device_id) throw new Error("device insert failed");

    // ===============================
    // INSERT ticket
    // ===============================
    const ticket_no = `TCK-${Date.now()}`;

    const [ticketResult]: any = await conn.execute(
      `
      INSERT INTO tickets (
        ticket_no,
        customer_id,
        device_id,
        issue_type_id,
        issue_title,
        issue_detail,
        priority_code,
        impact_level,
        urgency_level,
        department_id,
        assigned_user_id,
        assigned_user_name,
        tag_id,
        status_code,
        is_service_case,
        is_reopen,
        reopen_count,
        opened_at,
        created_by,
        created_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, 0, 0, NOW(), ?, COALESCE(?, NOW())
      )
      `,
      [
        ticket_no,
        customer_id,
        device_id,
        issue_type_id,
        issue_title,
        issue_detail,
        priority_code,
        impact_level,
        urgency_level,
        department_id,
        assigned_user_id,
        assigned_user_name,
        tag_id,
        status_code,
        is_service_case,
        created_by,
        created_at,
      ]
    );

    const ticket_id = ticketResult.insertId;
    if (!ticket_id) throw new Error("ticket insert failed");

    // ===============================
    // INSERT ticket_service (เฉพาะ Service)
    // ===============================
    if (is_service_case === 1 && body.service) {
      const {
        service_types,
        work_order_no,
        cost_estimate,
        serial_before,
        serial_after,
        replaced_parts,
        service_note,
      } = body.service;

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
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
    // INSERT ticket_resolution (optional)
    // ===============================
    if (resolution_text && resolution_text !== "") {
      await conn.execute(
        `
        INSERT INTO ticket_resolution (
          ticket_id,
          resolution_text,
          resolution_by,
          resolution_at
        ) VALUES (
          ?, ?, ?, NOW()
        )
        `,
        [ticket_id, resolution_text, resolution_by]
      );
    }

    await conn.commit();

    return Response.json({
      message: "Customer, Device, Ticket and Resolution created successfully",
      customer_id,
      device_id,
      ticket_id,
      ticket_no,
      is_service_case,
    });
  } catch (err) {
    await conn.rollback();
    console.error("ERROR:", err);

    return Response.json(
      { message: "transaction failed", error: String(err) },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
