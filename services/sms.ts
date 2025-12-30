import { createSmsClient, normalizeThaiPhone } from "@/lib/sms";

interface SendSatisfactionSmsParams {
  phone: string;
  surveyUrl: string;
}

const smsClient = createSmsClient();

// export async function sendSatisfactionSms({
//   phone,
//   surveyUrl,
// }: SendSatisfactionSmsParams) {
//   const to = normalizeThaiPhone(phone);

//   const message = `
// IT Hotline
// ขอประเมินความพึงพอใจการให้บริการ
// คลิกลิงก์: ${surveyUrl}

// (ลิงก์ใช้ได้ครั้งเดียว ภายใน 7 วัน)
// `.trim();

//   return smsClient.send({
//     to,
//     message,
//   });
// }

export async function sendSatisfactionSms({
  phone,
  surveyUrl,
}: SendSatisfactionSmsParams) {
  const to = normalizeThaiPhone(phone);

  console.log("=== SEND SMS ===");
  console.log("TO:", to);
  console.log("URL:", surveyUrl);

  const message = `
IT Hotline
ขอประเมินความพึงพอใจการให้บริการ
คลิกลิงก์: ${surveyUrl}
`.trim();

  return smsClient.send({
    to,
    message,
  });
}
