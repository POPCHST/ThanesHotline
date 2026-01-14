// src/services/service-workorder.util.ts
export async function generateWorkOrderNo(conn: any) {
  const [rows]: any = await conn.execute(`
    SELECT COUNT(*)
    FROM ticket_service
    WHERE created_at >= CURDATE()
      AND created_at < CURDATE() + INTERVAL 1 DAY
  `);

  // 👇 ใช้ key ตรง ๆ จาก mysql
  const count = Number(rows?.[0]?.["COUNT(*)"] ?? 0);
  const running = String(count + 1).padStart(4, "0");

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  console.log("GEN WO:", date, running); // 👈 ใส่ไว้ debug

  return `WO-${date}-${running}`;
}
