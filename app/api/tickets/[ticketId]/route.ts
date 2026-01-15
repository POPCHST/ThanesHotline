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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ticket_id:
 *                   type: integer
 *                   example: 51
 *                 ticket_no:
 *                   type: string
 *                   example: TCK-1768446030607
 *                 issue_title:
 *                   type: string
 *                   example: เครื่องไม่ดูดเม็ดยา
 *                 issue_detail:
 *                   type: string
 *                   example: ตรวจสอบแล้ว sensor ค้าง
 *                 priority_code:
 *                   type: string
 *                   example: HIGH
 *                 impact_level:
 *                   type: string
 *                   example: HIGH
 *                 urgency_level:
 *                   type: string
 *                   example: URGENT
 *                 status_code:
 *                   type: string
 *                   example: open
 *                 department_id:
 *                   type: integer
 *                   example: 3
 *                 assigned_user_name:
 *                   type: string
 *                   example: Papatsara H
 *                 created_at:
 *                   type: string
 *                   example: "2026-01-15 10:00:31"
 *                 customer_name:
 *                   type: string
 *                   example: ห้องยา ICU
 *                 customer_ward:
 *                   type: string
 *                   example: ICU
 *                 contact_name:
 *                   type: string
 *                   example: พยาบาลสมศรี
 *                 contact_phone:
 *                   type: string
 *                   example: 0812345678
 *                 device_name:
 *                   type: string
 *                   example: เครื่องนับยา YUYAMA
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
    const url = new URL(req.url);
    const ticketId = Number(url.pathname.split("/").pop());

    if (!ticketId) {
      return Response.json({ message: "invalid ticket id" }, { status: 400 });
    }
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

    sv.service_id,
    sv.service_types,
    sv.work_order_no,
    sv.cost_estimate,
    sv.serial_before,
    sv.serial_after,
    sv.replaced_parts,
    sv.service_note,
    sv.created_at AS service_created_at,
    sv.updated_at AS service_updated_at
    
    FROM tickets t
    LEFT JOIN m_customers c
        ON t.customer_id = c.customer_id
    LEFT JOIN m_devices d
        ON t.device_id = d.device_id
    LEFT JOIN ticket_service sv
        ON sv.ticket_id = t.ticket_id
  
    WHERE t.ticket_id = ?
    LIMIT 1
  `,
      [ticketId]
    );

    if (rows.length === 0) {
      return Response.json({ message: "ticket not found" }, { status: 404 });
    }

    return Response.json(rows[0]);
  } finally {
    conn.release();
  }
});
