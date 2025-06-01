import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { ServerResponse } from "http";
import { ResError } from "../types/common/res.type";

interface ExceptionResponse {
  message?: string;
  field?: string[];
  [key: string]: any;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ServerResponse | FastifyReply>();
    const status = exception.getStatus() || 400;
    const exceptionResponse = exception.getResponse() as ExceptionResponse;

    const errorResponse: ResError = {
      success: false,
      error: {
        code: status.toString(),
        message:
          typeof exceptionResponse === "string"
            ? exceptionResponse
            : exceptionResponse.message || "Internal server errorâ",
        ...(exceptionResponse.field && { field: exceptionResponse.field }),
      },
    };

    try {
      if (response instanceof ServerResponse) {
        // Xử lý cho ServerResponse (từ middleware)
        response.statusCode = status;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(errorResponse));
      } else {
        // Xử lý cho FastifyReply (từ controller)
        response.status(status).send(errorResponse);
      }
    } catch (error) {
      // console.error("Error sending error response:", error);
      if (response instanceof ServerResponse) {
        response.statusCode = 500;
        response.setHeader("Content-Type", "application/json");
        response.end(
          JSON.stringify({
            status: false,
            data: null,
            error: {
              code: "500",
              message: "Internal server error while handling exception",
            },
          })
        );
      } else {
        response.status(500).send({
          status: false,
          data: null,
          error: {
            code: "500",
            message: "Internal server error while handling exception",
          },
        });
      }
    }
  }
}
