/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get customers list
 *     tags:
 *       - Master
 *     responses:
 *       200:
 *         description: Success
 */
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`
    SELECT * FROM m_customers
  `);

  return Response.json(rows);
}
