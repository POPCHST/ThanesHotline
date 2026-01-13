/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 */
import pool from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  const formData = await req.formData();
  const username = formData.get("username") as string;

  if (!username) {
    return Response.json({ message: "username is required" }, { status: 400 });
  }

  const [rows]: any = await pool.query(
    "SELECT user_id FROM m_users WHERE username=? AND is_active=1 LIMIT 1",
    [username]
  );

  // ไม่เปิดเผยข้อมูล user
  if (rows.length === 0) {
    return Response.json({
      message: "หากมีผู้ใช้งาน ระบบจะติดต่อกลับ",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expired = new Date(Date.now() + 15 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  await pool.query(
    `UPDATE m_users SET reset_token=?, reset_token_expired=? WHERE user_id=?`,
    [token, expired, rows[0].user_id]
  );

  return Response.json({
    message: "สร้างคำขอรีเซ็ตรหัสผ่านเรียบร้อย",
  });
}
