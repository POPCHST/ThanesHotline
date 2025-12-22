/**
 * @swagger
 * /api/tag-status:
 *   get:
 *     summary: Get tag-status list
 *     tags:
 *       - Master
 *     responses:
 *       200:
 *         description: Success
 */
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`
    SELECT * FROM m_tags
  `);

  return Response.json(rows);
}
