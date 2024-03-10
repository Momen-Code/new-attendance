import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerUi = new DocumentBuilder()
  .setTitle('MedaTech API')
  .setDescription('MedaTech is a e-commerce service')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
