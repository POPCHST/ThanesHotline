/**
 * @swagger
 * /api/tickets/{ticketId}:
 *   get:
 *     summary: Get ticket detail by ticket ID
 *     tags:
 *       - Ticket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ticketId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 51
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket detail
 *       400:
 *         description: Invalid ticket id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ticket not found
 */

import pool from "@/lib/db";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req, user) => {
  const conn = await pool.getConnection();

  try {
    // ✅ ดึง ticketId แบบปลอดภัย
    const url = new URL(req.url);
    const ticketId = Number(url.pathname.split("/").filter(Boolean).pop());

    if (Number.isNaN(ticketId)) {
      return Response.json({ message: "invalid ticket id" }, { status: 400 });
    }

    // ✅ Query + LEFT JOIN ticket_service
    const [rows]: any = await conn.execute(
      `
      SELECT
        t.ticket_id,
        t.ticket_no,
        t.issue_title,
        t.issue_detail,
        t.priority_code,
        t.impact_level,
        t.urgency_level,
        t.status_code,
        t.department_id,
        t.assigned_user_name,
        t.created_at,
        t.is_service_case,

        c.customer_name,
        c.customer_ward,
        c.contact_name,
        c.contact_phone,

        d.device_name,

        ts.service_id,
        ts.service_types,
        ts.work_order_no,
        ts.cost_estimate,
        ts.serial_before,
        ts.serial_after,
        ts.replaced_parts,
        ts.service_note,
        ts.created_at AS service_created_at,
        ts.updated_at AS service_updated_at

      FROM tickets t
      LEFT JOIN m_customers c
        ON t.customer_id = c.customer_id
      LEFT JOIN m_devices d
        ON t.device_id = d.device_id
      LEFT JOIN ticket_service ts
        ON ts.ticket_id = t.ticket_id

      WHERE t.ticket_id = ?
      LIMIT 1
      `,
      [ticketId]
    );

    if (rows.length === 0) {
      return Response.json({ message: "ticket not found" }, { status: 404 });
    }

    const r = rows[0];

    // ⭐ จุดสำคัญ: map service เป็น object
    const result = {
      ticket_id: r.ticket_id,
      ticket_no: r.ticket_no,
      issue_title: r.issue_title,
      issue_detail: r.issue_detail,
      priority_code: r.priority_code,
      impact_level: r.impact_level,
      urgency_level: r.urgency_level,
      status_code: r.status_code,
      department_id: r.department_id,
      assigned_user_name: r.assigned_user_name,
      created_at: r.created_at,
      is_service_case: r.is_service_case,

      customer_name: r.customer_name,
      customer_ward: r.customer_ward,
      contact_name: r.contact_name,
      contact_phone: r.contact_phone,

      device_name: r.device_name,

      // ✅ frontend จะใช้ ticket.service ได้
      service: r.service_id
        ? {
            service_id: r.service_id,
            service_types: r.service_types,
            work_order_no: r.work_order_no,
            cost_estimate: r.cost_estimate,
            serial_before: r.serial_before,
            serial_after: r.serial_after,
            replaced_parts: r.replaced_parts,
            service_note: r.service_note,
            created_at: r.service_created_at,
            updated_at: r.service_updated_at,
          }
        : null,
    };

    return Response.json(result);
  } catch (err) {
    console.error("GET /api/tickets/:id error", err);
    return Response.json({ message: "internal server error" }, { status: 500 });
  } finally {
    conn.release();
  }
});
