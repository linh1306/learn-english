import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PipeExceptionFilter } from './common/filters/pipe-exception.filter';
import CONFIG from './common/config/index.config';
import fastifyCors from '@fastify/cors';

async function bootstrap() {
  const instant = new FastifyAdapter({ logger: false });

  await instant.register(fastifyCors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    instant,
  );

  // Global prefix and version setup
  app.setGlobalPrefix('api');
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  // });

  // Register global filters
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalFilters(new PrismaExceptionFilter());
  // app.useGlobalFilters(new PipeExceptionFilter());

  // Register global interceptors
  // app.useGlobalInterceptors(new TransformInterceptor());
  // app.useGlobalInterceptors(new ResponseInterceptor());

  // Register global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('Social Learning Platform API')
    .setDescription('The Social Learning Platform API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.getHttpAdapter().get('/api-json', (req, res) => {
    res.send(document);
  });

  // Start the application
  const port = Number(process.env.PORT) || CONFIG.port || 3000;
  console.log(`App is listening on port: ${port}`);
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
