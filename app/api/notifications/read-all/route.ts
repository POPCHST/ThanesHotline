/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read for current user
 *     tags:
 *       - Notification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: all notifications marked as read
 *       401:
 *         description: Unauthorized
 */

import pool from "@/lib/db";

export async function PUT(req: Request) {
  const conn = await pool.getConnection();

  try {
    const userId = (req as any).user?.user_id;
    if (!userId) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    await conn.execute(
      `
      UPDATE notifications
      SET is_read = 1
      WHERE user_id = ?
      `,
      [userId]
    );

    return Response.json({ message: "all notifications marked as read" });
  } catch (err) {
    console.error("PUT /api/notifications/read-all error:", err);
    return Response.json(
      { message: "failed to mark notifications as read" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
