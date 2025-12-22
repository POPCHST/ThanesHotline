/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get departments list
 *     tags:
 *       - Master
 *     responses:
 *       200:
 *         description: Success
 */
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`
    SELECT * FROM m_departments
  `);

  return Response.json(rows);
}
