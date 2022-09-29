import * as Joi from "joi";

export const JoiSchema = Joi.object({
  APP_NAME: Joi.string(),
  APP_ENV: Joi.string(),
  APP_PORT: Joi.number(),
  APP_URL: Joi.string(),
  APP_PREFIX: Joi.string(),

  COOKIE_SECRET: Joi.string(),
  JWT_SECRET: Joi.string(),
  JWT_EXPIRE: Joi.string(),
  JWT_REFRESH_SECRET: Joi.string(),
  JWT_REFRESH_EXPIRE: Joi.string(),

  AWS_ID: Joi.string(),
  AWS_SECRET: Joi.string(),
  AWS_REGION: Joi.string(),
  AWS_BUCKET: Joi.string(),

  PG_CLIENT: Joi.string(),
  PG_HOST: Joi.string(),
  PG_PORT: Joi.number(),
  PG_USER: Joi.string(),
  PG_PASSWORD: Joi.string(),
  PG_DATABASE: Joi.string(),
  RUN_MIGRATIONS: Joi.boolean(),
});
