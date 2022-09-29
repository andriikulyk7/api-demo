import { applyDecorators, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiResponse } from "@nestjs/swagger";
import { UserDoc } from "../user/user.doc";
import { UpdatePasswordDto } from "@dto";

export type UserDecoratorType =
  | "profile"
  | "analitics"
  | "requests"
  | "request"
  | "secure";

function ApiRequests() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiConsumes("application/json"),
    ApiResponse({
      status: 200,
      schema: UserDoc.requests,
    })
  );
}

function ApiRequest() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiConsumes("application/json"),
    ApiResponse({
      status: 201,
      schema: UserDoc.request,
    })
  );
}

function ApiSecure() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiConsumes("application/json"),
    ApiResponse({
      status: 200,
      schema: UserDoc.secure,
    }),
    ApiBody({ type: UpdatePasswordDto })
  );
}

function ApiAnalitics() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiResponse({
      status: 200,
      schema: UserDoc.dashboard,
    })
  );
}

export function ApiUserDoc(type: UserDecoratorType) {
  const decoratorType = {
    analitics: ApiAnalitics,
    requests: ApiRequests,
    request: ApiRequest,
    secure: ApiSecure,
  };

  const decorator = decoratorType[type];

  return decorator();
}
