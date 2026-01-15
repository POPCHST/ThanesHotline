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
import jwt from "jsonwebtoken";

export async function PUT(req: Request) {
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

    const userId = decoded.user_id; // 🔥 ตัวเดียวกับ DB

    if (!userId) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    // 4️⃣ update
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
    return Response.json({ message: "invalid token" }, { status: 401 });
  } finally {
    conn.release();
  }
}
