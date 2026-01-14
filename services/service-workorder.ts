// src/services/service-workorder.util.ts

export async function generateWorkOrderNo(conn: any) {
  const [rows]: any = await conn.execute(`
    SELECT COUNT(*) AS cnt
    FROM ticket_service
    WHERE DATE(created_at) = CURDATE()
  `);

  const next = Number(rows?.[0]?.cnt ?? 0) + 1;
  const running = String(next).padStart(4, "0");

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  return `WO-${date}-${running}`;
}
