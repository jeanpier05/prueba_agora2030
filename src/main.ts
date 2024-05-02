import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as chalk from 'chalk';
import rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const HOST = configService.get('HOST', 'localhost');
  const PORT = configService.get('PORT');

  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
  );
  app.use(
    rateLimit({
      windowMs: 1000 * 60 * 60,
      max: 1000, // 1000 requests por windowMs
      message:
        '⚠️  Too many request created from this IP, please try again after an hour',
    }),
  );

  // Global prefix for all routes.
  app.setGlobalPrefix('api/v1');

  // Use helmet for security.
  app.use(helmet());

  // Enable CORS.
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      // forbidNonWhitelisted: true, // 禁止 无装饰器验证的数据通过
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      stopAtFirstError: true,
      exceptionFactory: (errors) =>
        new UnprocessableEntityException(
          errors.map((e) => {
            const rule = Object.keys(e.constraints!)[0];
            const msg = e.constraints![rule];
            return msg;
          })[0],
        ),
    }),
  );

  // Enables the API docs auto-generation.
  setupSwagger(app);

  await app.listen(PORT);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  Logger.log(
    `🚀  Server is listening on port ${chalk.hex('#87e8de').bold(`${PORT}`)}`,
  );
}
bootstrap();
