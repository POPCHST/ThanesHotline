// /lib/mail.ts
import nodemailer from "nodemailer";

if (
  !process.env.MAIL_HOST ||
  !process.env.MAIL_PORT ||
  !process.env.MAIL_USER ||
  !process.env.MAIL_PASS
) {
  console.warn("⚠️ MAIL env is not fully configured");
}

export const mailTransporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false, // true เฉพาะ port 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
