// /services/mail.ts
import { mailTransporter } from "@/lib/mail";

interface SendSatisfactionEmailParams {
  to: string;
  ticketId: number;
  surveyUrl: string;
}

export async function sendSatisfactionEmail({
  to,
  ticketId,
  surveyUrl,
}: SendSatisfactionEmailParams) {
  return mailTransporter.sendMail({
    from: process.env.MAIL_FROM ?? '"IT Hotline" <no-reply@localhost>',
    to,
    subject: "ขอประเมินความพึงพอใจการให้บริการ IT Hotline",
    html: `
      <p>เรียนผู้ใช้งาน</p>

      <p>
        Ticket หมายเลข <b>#${ticketId}</b> ได้รับการดำเนินการเรียบร้อยแล้ว
      </p>

      <p>
        กรุณาคลิกที่ลิงก์ด้านล่างเพื่อประเมินความพึงพอใจในการให้บริการ
      </p>

      <p style="margin:16px 0;">
        <a href="${surveyUrl}"
           style="
             display:inline-block;
             padding:10px 16px;
             background:#2563eb;
             color:#fff;
             text-decoration:none;
             border-radius:6px;
             font-size:15px;
           ">
          ⭐ ให้คะแนนการบริการ
        </a>
      </p>

      <p style="color:#6b7280;font-size:12px;">
        ลิงก์นี้ใช้ได้เพียงครั้งเดียว และจะหมดอายุภายใน 7 วัน
      </p>

      <p>
        ขอบคุณครับ<br/>
        IT Hotline Team
      </p>
    `,
  });
}
