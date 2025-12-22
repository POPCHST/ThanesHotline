/**
 * @swagger
 * /api/issue-categories:
 *   get:
 *     summary: Get issue types
 *     tags:
 *       - Master
 *     responses:
 *       200:
 *         description: Success
 */
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`SELECT
      category_id,
      category_code,
      category_name,
      category_order,
      is_active,
      CONVERT_TZ(created_at, '+00:00', '+07:00') AS created_at,
      CONVERT_TZ(updated_at, '+00:00', '+07:00') AS updated_at
    FROM m_issue_categories`);

  return Response.json(rows);
}
