import { registerAs } from "@nestjs/config";

export default registerAs("db", () => ({
  type: process.env.PG_CLIENT,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: true,
  migrationsRun: true,
  dropSchema: true,
  logging: true,
  migrationsTableName: "migrations",
  entities: ["dist/common/entity/**/*.entity{.ts,.js}"],
  migrations: ["dist/module/db/migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: "db/migrations",
  },
}));
