/**
 * @swagger
 * /api/ticket-status-service:
 *   get:
 *     summary: Get ticket-status-service list
 *     tags:
 *       - Master
 *     responses:
 *       200:
 *         description: Success
 */
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`
    SELECT * FROM m_ticket_status_service ORDER BY status_sv_order ASC
  `);

  return Response.json(rows);
}
