// /lib/sms.ts
import twilio from "twilio";

/**
 * สร้าง Twilio SMS client
 */
export function createSmsClient() {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );

  return {
    async send({ to, message }: { to: string; message: string }) {
      return client.messages.create({
        to,
        from: process.env.TWILIO_FROM!,
        body: message,
      });
    },
  };
}

/**
 * helper แปลงเบอร์ไทย → international format
 * 08xxxxxxxx → +668xxxxxxxx
 */
export function normalizeThaiPhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, "");

  if (cleaned.startsWith("0")) {
    return "+66" + cleaned.slice(1);
  }

  if (cleaned.startsWith("66")) {
    return "+" + cleaned;
  }

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  return "+" + cleaned;
}
