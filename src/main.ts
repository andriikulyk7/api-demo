import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { docBuilder } from "@doc";
import { AppModule } from "./app.module";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig: ConfigService = app.get(ConfigService);
  const appLogger = new Logger("Logger");

  const PORT = appConfig.get<number>("app.port");
  const PREFIX = appConfig.get<string>("app.prefix");
  const SERVER_URL = appConfig.get<string>("app.url");
  const SERVER_NAME = appConfig.get<string>("app.name");
  const SERVER_ENV = appConfig.get<string>("app.env");

  const apiDocumentation = docBuilder(app, {
    port: PORT,
    prefix: PREFIX,
    serverUrl: SERVER_URL,
    serverName: SERVER_NAME,
  });

  SwaggerModule.setup("api-doc", app, apiDocumentation);

  app.enableCors({
    credentials: true,
    origin: "*",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  app.setGlobalPrefix(PREFIX);
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

  await app.listen(PORT, () => {
    appLogger.verbose(
      `* Server ${SERVER_NAME} has been started on ${SERVER_URL} on port ${PORT} in ${SERVER_ENV} mode *`
    );
  });
}

bootstrap().catch((err) => console.error(err));
