/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required: [username, password]
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
    `
    SELECT
      u.user_id,
      u.username,
      u.password,
      u.full_name,
      u.role_id,
      u.department_id,
      u.is_active AS user_active,
      d.department_code,
      d.department_name,
      d.is_active AS department_active
    FROM m_users u
    INNER JOIN m_departments d ON u.department_id = d.department_id
    WHERE u.username = ?
    LIMIT 1
    `,
    [username]
  );

  if (rows.length === 0) {
    return Response.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  }

  const user = rows[0];

  if (user.user_active !== 1)
    return Response.json({ message: "User is inactive" }, { status: 403 });

  if (user.department_active !== 1)
    return Response.json(
      { message: "Department is inactive" },
      { status: 403 }
    );

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return Response.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );

  const token = jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
      role_id: user.role_id,
      department_id: user.department_id,
      department_code: user.department_code,
    },
    process.env.JWT_SECRET!,
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
      department_code: user.department_code,
      department_name: user.department_name,
    },
  });
}
