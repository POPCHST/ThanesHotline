/**
 * @swagger
 * /api/ticket-status:
 *   get:
 *     summary: Get ticket-status list
 *     tags:
 *       - Master
 *     responses:
 *       200:
 *         description: Success
 */
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`
    SELECT * FROM m_ticket_status
  `);

  return Response.json(rows);
}
