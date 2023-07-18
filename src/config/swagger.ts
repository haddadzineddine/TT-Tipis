import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('Test technique x Tipsi')
  .setVersion('1.0')
  .addTag('Tipsi')
  .build();
