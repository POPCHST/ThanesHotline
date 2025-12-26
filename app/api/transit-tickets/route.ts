/**
 * @swagger
 * /api/transit-tickets:
 *   post:
 *     summary: Create customer, device and ticket in one transaction (auto id only)
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
 *               - priority_code
 *               - department_id
 *               - created_by
 *             properties:
 *               customer_name:
 *                 type: string
 *                 example: ห้องยา ICU
 *               customer_ward:
 *                 type: string
 *                 example: ICU
 *               contact_name:
 *                 type: string
 *                 example: พยาบาลสมศรี
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
 *               tag_id:
 *                 type: integer
 *                 example: 4
 *               issue_title:
 *                 type: string
 *                 example: เครื่องนับยาไม่ดูดเม็ดยา
 *               issue_detail:
 *                 type: string
 *                 example: เครื่องหยุดทำงานหลังเปิด 5 นาที
 *               priority_code:
 *                 type: string
 *                 example: HIGH
 *               impact_level:
 *                 type: string
 *                 example: HIGH
 *               urgency_level:
 *                 type: string
 *                 example: URGENT
 *               department_id:
 *                 type: integer
 *                 example: 2
 *               created_by:
 *                 type: integer
 *                 example: 1
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-26 08:00"
 *
 *     responses:
 *       200:
 *         description: Created customer, device and ticket successfully
 */
import pool from "@/lib/db";

export async function POST(req: Request) {
  const conn = await pool.getConnection();

  try {
    const body = await req.json();
    console.log("REQUEST BODY:", body);

    // ===== customer =====
    const customer_name = body.customer_name;
    const customer_ward = body.customer_ward;
    const contact_name = body.contact_name;
    const contact_phone = body.contact_phone;

    // ===== device =====
    const device_name = body.device_name;

    // ===== ticket =====
    const issue_title = body.issue_title;
    const issue_detail = body.issue_detail;
    const priority_code = body.priority_code;
    const department_id = Number(body.department_id);

    const issue_type_id = body.issue_type_id
      ? Number(body.issue_type_id)
      : null;
    const tag_id = body.tag_id ? Number(body.tag_id) : null;
    const impact_level = body.impact_level ?? null;
    const urgency_level = body.urgency_level ?? null;

    const created_by = Number(body.created_by);

    // รองรับ "2025-12-26 08:00" และ "2025-12-26T08:00:00"
    const created_at = body.created_at
      ? new Date(
          body.created_at.includes("T")
            ? body.created_at
            : body.created_at.replace(" ", "T") + ":00"
        )
      : null;

    // ===== validation =====
    if (
      !customer_name ||
      !customer_ward ||
      !contact_name ||
      !contact_phone ||
      !device_name ||
      !issue_title ||
      !issue_detail ||
      !priority_code ||
      !department_id ||
      !created_by
    ) {
      return Response.json(
        { message: "missing required fields" },
        { status: 400 }
      );
    }

    await conn.beginTransaction();

    // ===== insert customer =====
    const [custResult]: any = await conn.execute(
      `
      INSERT INTO m_customers (
        customer_name,
        customer_ward,
        contact_name,
        contact_phone
      ) VALUES (?, ?, ?, ?)
      `,
      [customer_name, customer_ward, contact_name, contact_phone]
    );
    const customer_id = custResult.insertId;

    // ===== insert device =====
    const [devResult]: any = await conn.execute(
      `INSERT INTO m_devices (device_name) VALUES (?)`,
      [device_name]
    );
    const device_id = devResult.insertId;

    // ===== generate ticket_no =====
    const ticket_no = `TCK-${Date.now()}`;

    // ===== insert ticket =====
    await conn.execute(
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
        tag_id,
        status_code,
        is_service_case,
        is_reopen,
        reopen_count,
        opened_at,
        created_by,
        created_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open',
        0, 0, 0, NOW(), ?, COALESCE(?, NOW())
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
        tag_id,
        created_by,
        created_at,
      ]
    );

    await conn.commit();

    return Response.json({
      message: "Customer, Device and Ticket created successfully",
      customer_id,
      device_id,
      ticket_no,
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
