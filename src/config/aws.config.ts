import { registerAs } from "@nestjs/config";

export default registerAs("aws", () => ({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  bucket: process.env.AWS_BUCKET,
  region: process.env.AWS_REGION,
}));
