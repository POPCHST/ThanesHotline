/**
 * @swagger
 * /api/tickets/score:
 *   get:
 *     summary: Get ticket satisfaction scores
 *     tags:
 *       - Ticket
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: assigned_user_id
 *         schema:
 *           type: integer
 *         description: |
 *           Filter by assigned user (ADMIN only).
 *           IT will be forced to see own data.
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
 *                   comment:
 *                     type: string
 *                     example: งานเรียบร้อยมาก
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
    const url = new URL(req.url);
    const qAssigned = url.searchParams.get("assigned_user_id");

    let assignedUserId: number | null = null;

    // ADMIN → เลือกดูใครก็ได้
    if (user.department_code === "ADMIN") {
      assignedUserId = qAssigned ? Number(qAssigned) : null;
    }
    // IT / non-admin → ดูของตัวเองเท่านั้น
    else {
      assignedUserId = user.user_id;
    }

    const [rows]: any = await conn.execute(
      `
      SELECT
        t.ticket_id,
        t.ticket_no,
        t.assigned_user_id,
        u.full_name AS assigned_user_name,
        s.score,
        s.comment,
        s.rated_at,
        t.updated_at
      FROM tickets t
      INNER JOIN ticket_satisfaction s
        ON s.ticket_id = t.ticket_id
        AND s.is_used = 1
      INNER JOIN m_users u
        ON u.user_id = t.assigned_user_id
      WHERE
        (? IS NULL OR t.assigned_user_id = ?)
      ORDER BY
        s.rated_at DESC,
        t.updated_at DESC
      `,
      [assignedUserId, assignedUserId],
    );

    return Response.json(rows);
  } catch (err) {
    console.error("GET /api/tickets/score error:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
});
