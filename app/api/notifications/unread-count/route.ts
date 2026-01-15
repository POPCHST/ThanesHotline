/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get unread notification count of current user
 *     tags:
 *       - Notification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread notification count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 unread:
 *                   type: integer
 *                   example: 3
 *       401:
 *         description: Unauthorized
 */
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const conn = await pool.getConnection();

  try {
    // 1️⃣ อ่าน Authorization header
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    // 2️⃣ แยก token
    const token = auth.replace("Bearer ", "");

    // 3️⃣ verify JWT
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const userId = decoded.user_id; // 🔥 ตรงกับ DB

    if (!userId) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    // 4️⃣ query DB
    const [[row]]: any = await conn.execute(
      `
      SELECT COUNT(*) AS unread
      FROM notifications
      WHERE user_id = ?
        AND is_read = 0
      `,
      [userId]
    );

    return Response.json({ unread: row.unread });
  } catch (err) {
    console.error("GET /api/notifications/unread-count error:", err);
    return Response.json({ message: "invalid token" }, { status: 401 });
  } finally {
    conn.release();
  }
}
