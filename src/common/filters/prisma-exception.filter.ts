import { Catch, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { ServerResponse } from "http";
import { EXCEPTIONS_PRISMA } from "../config/prisma-err.config";
import { ResError } from "../types/common/res.type";
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ServerResponse | FastifyReply>();
    const status = 400;

    const res: ResError = {
      success: false,
    };

    if (
      typeof exception.code === "string" &&
      exception.code in EXCEPTIONS_PRISMA
    ) {
      res.error =
        EXCEPTIONS_PRISMA[exception.code as keyof typeof EXCEPTIONS_PRISMA];
    } else {
      res.error = {
        code: "P000",
        message: "database error",
      };
    }

    try {
      if (response instanceof ServerResponse) {
        response.statusCode = status;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(res));
      } else {
        response.status(status).send(res);
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
