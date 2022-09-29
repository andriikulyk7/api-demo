import { registerAs } from "@nestjs/config";

export default registerAs("mailchimp", () => ({
  key: process.env.MAILCHIMP_KEY,
  sender_email: process.env.MAILCHIMP_SENDER_EMAIL,
}));
