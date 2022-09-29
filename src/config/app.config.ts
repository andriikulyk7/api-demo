import { registerAs } from "@nestjs/config";

export default registerAs("app", () => ({
  env: process.env.APP_ENV,
  prefix: process.env.APP_PREFIX,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  port: process.env.APP_PORT,
  web_url: process.env.WEB_APP_URL,
}));
