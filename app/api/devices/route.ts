/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get devices list
 *     tags:
 *       - Master
 *     responses:
 *       200:
 *         description: Success
 */
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`
    SELECT * FROM m_devices
  `);

  return Response.json(rows);
}
