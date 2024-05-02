import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Swagger creates a UI for each of app's endpoints to easy consumption.
 */
export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Prueba Técnica Backend')
    .addApiKey({ type: 'apiKey', name: 'Api-Key', in: 'header' }, 'Api-Key')
    .setDescription('Jeans Pierre -  jean.pier.164@gmail.com')
    .setVersion('1.0')
    // .addTag('agora2030')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('documentation', app, document);
}

/**
 * Reference: https://docs.nestjs.com/openapi/introduction
 */
