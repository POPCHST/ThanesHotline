/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get Users list
 *     tags:
 *       - Master
 *     responses:
 *       200:
 *         description: Success
 */
import pool from "@/lib/db";

export async function GET() {
  const [rows] = await pool.query(`
    SELECT
      user_id,
      username,
      full_name,
      password,
      role_id,
      department_id,
      is_active,
      CONVERT_TZ(created_at, '+00:00', '+07:00') AS created_at
    FROM m_users
  `);

  return Response.json(rows);
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user
 *     tags:
 *       - Insert
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - full_name
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               full_name:
 *                 type: string
 *                 example: Admin Dev
 *               password:
 *                 type: string
 *                 example: 123456
 *               role_id:
 *                 type: integer
 *                 example: 1
 *               department_id:
 *                 type: integer
 *                 example: 1
 *               is_active:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Created
 */

import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const formData = await req.formData();

  const username = formData.get("username") as string;
  const full_name = formData.get("full_name") as string | null;
  const password = formData.get("password") as string;
  const role_id = Number(formData.get("role_id") ?? 0);
  const department_id = Number(formData.get("department_id") ?? 0);
  const is_active = Number(formData.get("is_active") ?? 1);

  // ===== validation =====
  if (!username || !full_name || !password) {
    return Response.json(
      { message: "username, full_name and password are required" },
      { status: 400 }
    );
  }

  // ===== check duplicate =====
  const [dup]: any = await pool.query(
    `SELECT user_id FROM m_users WHERE username = ? LIMIT 1`,
    [username]
  );

  if (dup.length > 0) {
    return Response.json(
      { message: "username already exists" },
      { status: 409 }
    );
  }

  // ===== hash password =====
  const hashedPassword = await bcrypt.hash(password, 10);

  const now = new Date();
  const createdAt = now.toISOString().slice(0, 19).replace("T", " ");

  // ===== insert =====
  await pool.query(
    `
    INSERT INTO m_users
      (username, full_name, password, role_id, department_id, is_active, created_at)
    VALUES
      (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      username,
      full_name,
      hashedPassword,
      role_id,
      department_id,
      is_active,
      createdAt,
    ]
  );

  return Response.json(
    { message: "User created successfully" },
    { status: 200 }
  );
}
