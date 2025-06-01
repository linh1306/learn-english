import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

interface PaginatedResponseOptions {
  model: Type<any>;
  description?: string;
}

export const ApiPaginatedResponse = (options: PaginatedResponseOptions) => {
  return applyDecorators(
    ApiExtraModels(options.model),
    ApiOkResponse({
      description: options.description || 'Paginated response',
      schema: {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(options.model) },
          },
          meta: {
            type: 'object',
            properties: {
              total: {
                type: 'number',
                example: 100,
              },
              page: {
                type: 'number',
                example: 1,
              },
              limit: {
                type: 'number',
                example: 10,
              },
              totalPages: {
                type: 'number',
                example: 10,
              },
            },
          },
        },
      },
    }),
  );
};
