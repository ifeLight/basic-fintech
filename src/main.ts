import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Basic Fintech API')
    .setDescription('The basic fintech API description')
    .setVersion('1.0')
    // .addTag('cats')
    .build();
  const documentFactory = () => {
    return SwaggerModule.createDocument(app, swaggerConfig);
  };
  SwaggerModule.setup('docs', app, documentFactory);
  await app.listen(3000);
}

bootstrap();
