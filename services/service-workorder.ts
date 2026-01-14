// src/services/service-workorder.util.ts

export async function generateWorkOrderNo(conn: any) {
  const [rows]: any = await conn.execute(`
    SELECT COUNT(*) + 1 AS running
    FROM ticket_service
    WHERE DATE(created_at) = CURDATE()
  `);

  const running = String(rows[0].running).padStart(4, "0");
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  return `WO-${date}-${running}`;
}
