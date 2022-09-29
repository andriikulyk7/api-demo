import { NestExpressApplication } from "@nestjs/platform-express";
import { OpenAPIObject } from "@nestjs/swagger/dist/interfaces";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ApiUserDoc, UserDecoratorType } from "@doc/decorator";

const API_DOC_DECORATORS = {
  user: ApiUserDoc,
};

type ControllerType = "authentication" | "user" | "project";

type DecoratorType = UserDecoratorType;

interface IApiDocOptions {
  controller: ControllerType;
  path: DecoratorType;
}

export function ApiDocumentation(options: IApiDocOptions) {
  const { controller, path } = options;
  const decorator = API_DOC_DECORATORS[controller] as any;

  return decorator(path);
}

export function docBuilder<A extends NestExpressApplication, O>(
  app: A,
  options: O
): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle("Api DEMO")
    .setVersion("1.0.0")
    .addServer(`${options["serverUrl"]}/${options["prefix"]}`)
    .addBearerAuth(
      { type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header" },
      "Access_token"
    )
    .build();

  return SwaggerModule.createDocument(app, config);
}
