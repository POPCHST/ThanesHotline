/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get latest notifications of current user
 *     tags:
 *       - Notification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 12
 *                   type:
 *                     type: string
 *                     example: assign_ticket
 *                   ref_type:
 *                     type: string
 *                     example: ticket
 *                   ref_id:
 *                     type: integer
 *                     example: 49
 *                   title:
 *                     type: string
 *                     example: มีงานใหม่ถูกมอบหมาย
 *                   message:
 *                     type: string
 *                     example: คุณได้รับมอบหมายงาน Ticket #TCK-1768
 *                   is_read:
 *                     type: integer
 *                     example: 0
 *                   created_at:
 *                     type: string
 *                     example: "2026-01-15 12:44:54"
 *       401:
 *         description: Unauthorized
 */

import pool from "@/lib/db";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (req, user) => {
  const conn = await pool.getConnection();

  try {
    const userId = user.user_id;

    const [rows]: any = await conn.execute(
      `
      SELECT
        id,
        type,
        ref_type,
        ref_id,
        title,
        message,
        is_read,
        created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 20
      `,
      [userId]
    );

    return Response.json(rows);
  } finally {
    conn.release();
  }
});
