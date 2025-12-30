// /services/sms.ts
import { createSmsClient, normalizeThaiPhone } from "@/lib/sms";

interface SendSatisfactionSmsParams {
  phone: string;
  surveyUrl: string;
}

/**
 * SMS client config
 */
const smsClient = createSmsClient({
  apiUrl: process.env.SMS_API_URL!,
  apiKey: process.env.SMS_API_KEY!,
  sender: process.env.SMS_SENDER ?? "IT-HOTLINE",
});

export async function sendSatisfactionSms({
  phone,
  surveyUrl,
}: SendSatisfactionSmsParams) {
  const to = normalizeThaiPhone(phone);

  const message = `
IT Hotline
ขอประเมินความพึงพอใจการให้บริการ
คลิกลิงก์: ${surveyUrl}

(ลิงก์ใช้ได้ครั้งเดียว ภายใน 7 วัน)
`.trim();

  return smsClient.send({
    to,
    message,
  });
}
