import { registerAs } from "@nestjs/config";

export default registerAs("linkedin", () => ({
  key: process.env.LINKEDIN_KEY,
  secret: process.env.LINKEDIN_SECRET,
}));
