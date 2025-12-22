/**
 * @swagger
 * /api/issue-types:
 *   get:
 *     summary: Get issue types
 *     description: ดึงรายการประเภทปัญหา
 *     tags:
 *       - Master
 *     responses:
 *       200:
 *         description: Success
 */
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(
    "SELECT issue_type_id, issue_title FROM m_issue_types"
  );

  return Response.json(rows);
}
