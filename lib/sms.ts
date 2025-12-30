// /lib/sms.ts
import axios from "axios";

interface SmsConfig {
  apiUrl: string;
  apiKey: string;
  sender?: string;
}

interface SendSmsParams {
  to: string;        // เบอร์ปลายทาง (+668xxxxxxxx)
  message: string;   // ข้อความ
}

export function createSmsClient(config: SmsConfig) {
  return {
    async send({ to, message }: SendSmsParams) {
      /**
       * NOTE:
       * - เปลี่ยน payload / header ให้ตรงกับ SMS Gateway ที่ใช้จริง
       * - โค้ดนี้เป็น generic pattern
       */
      return axios.post(
        config.apiUrl,
        {
          to,
          message,
          sender: config.sender,
        },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );
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

  return cleaned;
}
