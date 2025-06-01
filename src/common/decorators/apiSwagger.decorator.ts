import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

interface ApiCustomResponseOptions {
  summary: string;
  param?: string[];
  query?: Type<any>;
  response: {
    type: Type<any>;
    isArray?: boolean;
  };
}

export const ApiSwagger = (options: ApiCustomResponseOptions) => {
  const decorators: MethodDecorator[] = [
    ApiOperation({ summary: options.summary }),
    ApiOkResponse({
      description: `${options.summary} response`,
      type: options.response.type,
      isArray: options.response.isArray,
    }),
  ];

  // Thêm decorator cho các param nếu có
  if (options.param && options.param.length > 0) {
    options.param.forEach((param) => {
      decorators.push(
        ApiParam({
          name: param,
          required: true,
          type: String,
          description: `Path parameter: ${param}`,
        }),
      );
    });
  }

  // Thêm decorator cho query nếu có
  if (options.query) {
    decorators.push(
      ApiQuery({
        type: options.query,
        description: `Query parameters for ${options.summary}`,
      }),
    );
  }

  return applyDecorators(...decorators);
};
