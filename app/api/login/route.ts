/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login success
 *       401:
 *         description: Invalid username or password
 */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const formData = await req.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return Response.json(
      { message: "username and password are required" },
      { status: 400 }
    );
  }

  const [rows]: any = await pool.query(
    `SELECT user_id, username, password, full_name, role_id, department_id, is_active
     FROM m_users WHERE username = ? LIMIT 1`,
    [username]
  );

  if (rows.length === 0) {
    return Response.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }

  const user = rows[0];

  if (user.is_active !== 1) {
    return Response.json({ message: "User is inactive" }, { status: 403 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return Response.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { user_id: user.user_id, username: user.username, role_id: user.role_id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  return Response.json({
    message: "Login success",
    token,
    user: {
      user_id: user.user_id,
      username: user.username,
      full_name: user.full_name,
      role_id: user.role_id,
      department_id: user.department_id,
    },
  });
}
