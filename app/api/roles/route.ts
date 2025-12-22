/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get roles list
 *     tags:
 *       - Master
 *     responses:
 *       200:
 *         description: Success
 */
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`
    SELECT * FROM m_roles
  `);

  return Response.json(rows);
}
