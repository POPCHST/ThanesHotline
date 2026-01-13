/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 */
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const token = formData.get("token") as string;
  const newPassword = formData.get("new_password") as string;

  if (!token || !newPassword) {
    return Response.json(
      { message: "token and new_password are required" },
      { status: 400 }
    );
  }

  const [rows]: any = await pool.query(
    `SELECT user_id FROM m_users
     WHERE reset_token=? AND reset_token_expired > NOW()
     LIMIT 1`,
    [token]
  );

  if (rows.length === 0) {
    return Response.json(
      { message: "token ไม่ถูกต้องหรือหมดอายุแล้ว" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await pool.query(
    `UPDATE m_users
     SET password=?, reset_token=NULL, reset_token_expired=NULL
     WHERE user_id=?`,
    [hashed, rows[0].user_id]
  );

  return Response.json({
    message: "ตั้งรหัสผ่านใหม่เรียบร้อย",
  });
}
