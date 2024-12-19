import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Damai API')
    .setDescription('The Damai API description')
    .setVersion('1.0')
    .addServer('http://localhost:4000/api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.use(compression({ level: 4 }));

  SwaggerModule.setup('api-docs', app, document);

  app.enableCors();

  await app.listen(4000);
}
bootstrap();
