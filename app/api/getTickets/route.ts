// /**
//  * @swagger
//  * /api/getTickets:
//  *   get:
//  *     summary: Get tickets with filters
//  *     tags:
//  *       - Get
//  *     parameters:
//  *       - in: query
//  *         name: date_from
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: Start date (yyyy-mm-dd)
//  *         example: 2025-12-01
//  *       - in: query
//  *         name: date_to
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: End date (yyyy-mm-dd)
//  *         example: 2025-12-17
//  *       - in: query
//  *         name: status_code
//  *         schema:
//  *           type: string
//  *         description: Ticket status
//  *         example: open
//  *       - in: query
//  *         name: keyword
//  *         schema:
//  *           type: string
//  *         description: Search by ticket_no
//  *         example: TCK-20251217
//  *     responses:
//  *       200:
//  *         description: Success
//  */
// import pool from "@/lib/db";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);

//   const dateFrom = searchParams.get("date_from");
//   const dateTo = searchParams.get("date_to");
//   const statusCode = searchParams.get("status_code");
//   const keyword = searchParams.get("keyword");

//   let sql = `
//    SELECT
//     t.ticket_id,
//     t.ticket_no,

//     -- Customer
//     t.customer_id,
//     c.customer_name,
//     c.contact_name,
//     c.customer_ward,
//     c.contact_phone,

//     -- Device
//     t.device_id,
//     d.device_name,

//     -- Issue type
//     t.issue_type_id,

//     -- Ticket info
//     t.issue_title,
//     t.issue_detail,
//     t.priority_code,
//     t.impact_level,
//     t.urgency_level,

//     -- Department
//     t.department_id,
//     dp.department_name,

//     -- Assigned user
//     t.assigned_user_id,
//     ua.full_name AS assigned_user_name,

//     -- Created by
//     t.created_by,
//     uc.full_name AS created_by_name,

//     -- Tag
//     t.tag_id,
//     tg.tag_name,

//     -- Status
//     t.status_code,
//     st.status_name,

//     -- Flags
//     t.is_service_case,
//     t.is_reopen,
//     t.reopen_count,
//     t.is_deleted,

//     -- Dates
//     t.opened_at,
//     t.first_response_at,
//     t.resolved_at,
//     t.closed_at,

//     -- Audit
//     t.created_by,
//     t.created_at,
//     t.updated_at,

//     -- ===== Service : โชว์เฉพาะตอน is_service_case = 1 =====
//     CASE WHEN t.is_service_case = 1 THEN s.service_id      ELSE NULL END AS service_id,
//     CASE WHEN t.is_service_case = 1 THEN s.service_types   ELSE NULL END AS service_types,
//     CASE WHEN t.is_service_case = 1 THEN s.work_order_no   ELSE NULL END AS work_order_no,
//     CASE WHEN t.is_service_case = 1 THEN s.cost_estimate   ELSE NULL END AS cost_estimate,
//     CASE WHEN t.is_service_case = 1 THEN s.serial_before   ELSE NULL END AS serial_before,
//     CASE WHEN t.is_service_case = 1 THEN s.serial_after    ELSE NULL END AS serial_after,
//     CASE WHEN t.is_service_case = 1 THEN s.replaced_parts  ELSE NULL END AS replaced_parts,
//     CASE WHEN t.is_service_case = 1 THEN s.service_note    ELSE NULL END AS service_note,
//     CASE WHEN t.is_service_case = 1 THEN s.created_at      ELSE NULL END AS service_created_at,
//     CASE WHEN t.is_service_case = 1 THEN s.updated_at      ELSE NULL END AS service_updated_at

// FROM tickets t
// LEFT JOIN m_customers c       ON t.customer_id = c.customer_id
// LEFT JOIN m_devices d         ON t.device_id = d.device_id
// LEFT JOIN m_departments dp    ON t.department_id = dp.department_id
// LEFT JOIN m_users ua          ON t.assigned_user_id = ua.user_id
// LEFT JOIN m_users uc          ON t.created_by = uc.user_id
// LEFT JOIN m_tags tg           ON t.tag_id = tg.tag_id
// LEFT JOIN m_ticket_status st  ON t.status_code = st.status_code

// LEFT JOIN ticket_service s    ON t.ticket_id = s.ticket_id

//   `;

//   const params: any[] = [];

//   // ===== filter: date range =====
//   if (dateFrom) {
//     sql += ` AND DATE(t.opened_at) >= ?`;
//     params.push(dateFrom);
//   }

//   if (dateTo) {
//     sql += ` AND DATE(t.opened_at) <= ?`;
//     params.push(dateTo);
//   }

//   // ===== filter: status =====
//   if (statusCode) {
//     sql += ` AND t.status_code = ?`;
//     params.push(statusCode);
//   }

//   // ===== search: ticket_no =====
//   if (keyword) {
//     sql += ` AND t.ticket_no LIKE ?`;
//     params.push(`%${keyword}%`);
//   }

//   // ===== order =====
//   sql += ` ORDER BY t.created_at DESC`;

//   const [rows] = await pool.query(sql, params);

//   return Response.json(rows);
// }

/**
 * @swagger
 * /api/getTickets:
 *   get:
 *     summary: Get tickets with filters
 *     tags:
 *       - Get
 *     parameters:
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (yyyy-mm-dd)
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (yyyy-mm-dd)
 *       - in: query
 *         name: status_code
 *         schema:
 *           type: string
 *         description: Ticket status
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search by ticket_no
 *     responses:
 *       200:
 *         description: Success
 */

import pool from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const dateFrom = searchParams.get("date_from");
  const dateTo = searchParams.get("date_to");
  const statusCode = searchParams.get("status_code");
  const keyword = searchParams.get("keyword");

  let sql = `
  SELECT
    t.ticket_id,
    t.ticket_no,

    -- Customer
    t.customer_id,
    c.customer_name,
    c.contact_name,
    c.customer_ward,
    c.contact_phone,

    -- Device
    t.device_id,
    d.device_name,

    -- Issue type
    t.issue_type_id,

    -- Ticket info
    t.issue_title,
    t.issue_detail,
    t.priority_code,
    t.impact_level,
    t.urgency_level,

    -- Department
    t.department_id,
    dp.department_name,

    -- Assigned user
    t.assigned_user_id,
    ua.full_name AS assigned_user_name,

    -- Created by
    t.created_by,
    uc.full_name AS created_by_name,

    -- Tag
    t.tag_id,
    tg.tag_name,

    -- Status
    t.status_code,
    st.status_name,

    -- Flags
    t.is_service_case,
    t.is_reopen,
    t.reopen_count,
    t.is_deleted,

    -- Dates
    t.opened_at,
    t.first_response_at,
    t.resolved_at,
    t.closed_at,

    -- Audit
    t.created_at,
    t.updated_at,

    -- ===== Service =====
    CASE WHEN t.is_service_case = 1 THEN s.service_id     ELSE NULL END AS service_id,
    CASE WHEN t.is_service_case = 1 THEN s.service_types ELSE NULL END AS service_types,
    CASE WHEN t.is_service_case = 1 THEN s.work_order_no ELSE NULL END AS work_order_no,
    CASE WHEN t.is_service_case = 1 THEN s.cost_estimate ELSE NULL END AS cost_estimate,
    CASE WHEN t.is_service_case = 1 THEN s.serial_before ELSE NULL END AS serial_before,
    CASE WHEN t.is_service_case = 1 THEN s.serial_after  ELSE NULL END AS serial_after,
    CASE WHEN t.is_service_case = 1 THEN s.replaced_parts ELSE NULL END AS replaced_parts,
    CASE WHEN t.is_service_case = 1 THEN s.service_note  ELSE NULL END AS service_note,

    -- ===== Resolution Summary =====
    rj.resolution_count,
    rj.last_resolution_at,
    rj.resolutions

  FROM tickets t
  LEFT JOIN m_customers c      ON t.customer_id = c.customer_id
  LEFT JOIN m_devices d        ON t.device_id = d.device_id
  LEFT JOIN m_departments dp   ON t.department_id = dp.department_id
  LEFT JOIN m_users ua         ON t.assigned_user_id = ua.user_id
  LEFT JOIN m_users uc         ON t.created_by = uc.user_id
  LEFT JOIN m_tags tg          ON t.tag_id = tg.tag_id
  LEFT JOIN m_ticket_status st ON t.status_code = st.status_code
  LEFT JOIN ticket_service s   ON t.ticket_id = s.ticket_id

  -- ===== Resolution Aggregate (สำคัญ) =====
  LEFT JOIN (
    SELECT
      r.ticket_id,
      COUNT(*) AS resolution_count,
      MAX(r.resolution_at) AS last_resolution_at,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'resolution_id', r.resolution_id,
          'text', r.resolution_text,
          'by', r.resolution_by,
          'by_name', u.full_name,
          'at', r.resolution_at
        )
        ORDER BY r.resolution_at ASC
      ) AS resolutions
    FROM ticket_resolution r
    LEFT JOIN m_users u ON r.resolution_by = u.user_id
    GROUP BY r.ticket_id
  ) rj ON t.ticket_id = rj.ticket_id

  WHERE 1 = 1
  `;

  const params: any[] = [];

  // ===== filter: date range =====
  if (dateFrom) {
    sql += ` AND DATE(t.opened_at) >= ?`;
    params.push(dateFrom);
  }

  if (dateTo) {
    sql += ` AND DATE(t.opened_at) <= ?`;
    params.push(dateTo);
  }

  // ===== filter: status =====
  if (statusCode) {
    sql += ` AND t.status_code = ?`;
    params.push(statusCode);
  }

  // ===== search: ticket_no =====
  if (keyword) {
    sql += ` AND t.ticket_no LIKE ?`;
    params.push(`%${keyword}%`);
  }

  // sql += ` ORDER BY t.created_at DESC`;
  sql += ` ORDER BY 
  CASE WHEN t.status_code = 'close' THEN 1 ELSE 0 END ASC, 
  t.created_at DESC `;

  const [rows] = await pool.query(sql, params);

  return Response.json(rows);
}
