import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { WinstonLogger } from './app/shared/logger/winston.logger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { EntityNotFoundFilter } from './app/shared/filters/entity-not-found.filter';
import { ConfigService } from '@devon4node/config';
import { Config } from './app/shared/model/config/config.model';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configModule = app.get<ConfigService<Config>>(ConfigService);

  const logger = app.get(WinstonLogger);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        excludeExtraneousValues: true,
      },
    }),
  );
  app.useGlobalFilters(new EntityNotFoundFilter(logger));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configModule.values.defaultVersion,
  });
  app.use(helmet());
  app.enableCors({
    origin: '*',
    credentials: true,
    exposedHeaders: 'Authorization',
    allowedHeaders: 'authorization, content-type',
  });
  if (configModule.values.isDev) {
    const options = new DocumentBuilder()
      .setTitle(configModule.values.swaggerConfig?.swaggerTitle ?? 'NestJS application')
      .setDescription(configModule.values.swaggerConfig?.swaggerDescription ?? '')
      .setVersion(configModule.values.swaggerConfig?.swaggerVersion ?? '0.0.1')
      .addBearerAuth()
      .build();

    const swaggerDoc = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('v' + configModule.values.defaultVersion + '/api', app, swaggerDoc);
  }
  await app.listen(configModule.values.port);
}
bootstrap();
