/**
 * @swagger
 * /api/tickets/score:
 *   get:
 *     summary: Get ticket satisfaction scores
 *     tags:
 *       - Ticket
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ticket score list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ticket_id:
 *                     type: integer
 *                     example: 4
 *                   ticket_no:
 *                     type: string
 *                     example: TCK-1768652321410
 *                   assigned_user_id:
 *                     type: integer
 *                     example: 6
 *                   assigned_user_name:
 *                     type: string
 *                     example: POP Dev
 *                   score:
 *                     type: integer
 *                     example: 5
 *                   rated_at:
 *                     type: string
 *                     example: "2026-01-17 19:18:42"
 *                   updated_at:
 *                     type: string
 *                     example: "2026-01-17 12:18:41"
 *       401:
 *         description: Unauthorized
 */

import pool from "@/lib/db";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req, user) => {
  const conn = await pool.getConnection();

  try {
    const userId = user.user_id;
    const isAdmin = user.department === "ADMIN";

    const params: any[] = [];

    let sql = `
      SELECT
        t.id AS ticket_id,
        t.ticket_no,

        t.assigned_user_id,
        u.name AS assigned_user_name,

        s.score,
        s.rated_at,
        t.updated_at
      FROM tickets t
      LEFT JOIN users u
        ON u.id = t.assigned_user_id
      LEFT JOIN satisfaction s
        ON s.ticket_id = t.id
        AND s.is_used = 1
      WHERE s.score IS NOT NULL
    `;

    // non-admin เห็นเฉพาะงานที่ตัวเองรับผิดชอบ
    if (!isAdmin) {
      sql += ` AND t.assigned_user_id = ? `;
      params.push(userId);
    }

    sql += `
      ORDER BY
        s.rated_at DESC,
        t.updated_at DESC
    `;

    const [rows]: any = await conn.execute(sql, params);

    return Response.json(rows);
  } finally {
    conn.release();
  }
});
