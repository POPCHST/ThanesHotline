/**
 * @swagger
 * /api/transit-tickets:
 *   post:
 *     summary: Create new ticket
 *     tags:
 *       - Insert
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - issue_title
 *               - issue_detail
 *               - priority_code
 *               - department_id
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 12
 *               device_id:
 *                 type: integer
 *                 example: 5
 *               issue_type_id:
 *                 type: integer
 *                 example: 3
 *               tag_id:
 *                 type: integer
 *                 example: 4
 *               status_code:
 *                 type: string
 *                 example: open
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
 *     responses:
 *       200:
 *         description: Created
 */

import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // ===== get form data =====
    const customer_id = Number(formData.get("customer_id") ?? 0);
    const device_id = Number(formData.get("device_id") ?? 0);
    const issue_type_id = Number(formData.get("issue_type_id") ?? 0);
    const tag_id = Number(formData.get("tag_id") ?? 0);
    const status_code = (formData.get("status_code") as string) || "open";

    const issue_title = formData.get("issue_title") as string;
    const issue_detail = formData.get("issue_detail") as string;
    const priority_code = formData.get("priority_code") as string;
    const impact_level = formData.get("impact_level") as string | null;
    const urgency_level = formData.get("urgency_level") as string | null;
    const department_id = Number(formData.get("department_id") ?? 0);

    const created_by = 1; // TODO: ดึงจาก session / token

    // ===== validation =====
    if (!issue_title || !issue_detail || !priority_code || !department_id) {
      return Response.json(
        {
          message:
            "issue_title, issue_detail, priority_code, department_id are required",
        },
        { status: 400 }
      );
    }

    // ===== generate ticket_no (datetime + random) =====
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const rand = String(Math.floor(Math.random() * 100)).padStart(2, "0");

    const runNo = `${yyyy}${mm}${dd}-${hh}${mi}${ss}-${rand}`;
    const ticket_no = `TCK-${runNo}`;

    // ===== insert ticket =====
    await pool.query(
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
    created_at,
    updated_at
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    0, 0, 0, NOW(), ?, NOW(), NOW()
  )
  `,
      [
        ticket_no,
        customer_id || null,
        device_id || null,
        issue_type_id || null,
        issue_title,
        issue_detail,
        priority_code,
        impact_level,
        urgency_level,
        department_id,
        tag_id,
        status_code,
        created_by,
      ]
    );

    return Response.json(
      {
        message: "Ticket created successfully",
        ticket_no,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Create ticket error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
