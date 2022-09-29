import { registerAs } from "@nestjs/config";

export default registerAs("secure", () => ({
  cookie_secret: process.env.COOKIE_SECRET,
  admin_signup_secret: process.env.ADMIN_SIGNUP_SECRET,
  admin_signup_allow: process.env.ADMIN_SIGNUP_ALLOW,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expire: process.env.JWT_EXPIRE,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expire: process.env.JWT_REFRESH_EXPIRE,
}));
