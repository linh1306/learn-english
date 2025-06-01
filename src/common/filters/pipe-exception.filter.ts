import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ServerResponse } from 'http';
import { FastifyReply } from 'fastify';
import { ResError } from '@type/common';

export class PipeException extends HttpException {
  constructor(errors: ValidationError[]) {
    super(
      {
        errors,
        message: 'PipeException',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

@Catch(PipeException)
export class PipeExceptionFilter implements ExceptionFilter {
  catch(exception: PipeException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ServerResponse | FastifyReply>();
    const status = exception.getStatus() || 400;
    const exceptionResponse = exception.getResponse() as {
      errors: ValidationError[];
      message: string;
    };

    const errors: string[] = [];

    if (exceptionResponse.errors && Array.isArray(exceptionResponse.errors)) {
      exceptionResponse.errors.forEach((error) => {
        if (error.constraints) {
          errors.push(...Object.values(error.constraints));
        }
      });
    }

    const res: ResError = {
      error: { code: 'V001', message: 'validate', field: errors },
      success: false,
    };

    try {
      if (response instanceof ServerResponse) {
        response.statusCode = status;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(res));
      } else {
        response.status(status).send(res);
      }
    } catch (error) {
      // console.error("Error sending error response:", error);
      if (response instanceof ServerResponse) {
        response.statusCode = 500;
        response.setHeader('Content-Type', 'application/json');
        response.end(
          JSON.stringify({
            status: false,
            data: null,
            error: {
              code: '500',
              message: 'Internal server error while handling exception',
            },
          }),
        );
      } else {
        response.status(500).send({
          status: false,
          data: null,
          error: {
            code: '500',
            message: 'Internal server error while handling exception',
          },
        });
      }
    }
  }
}
