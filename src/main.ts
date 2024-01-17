import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { WinstonModule } from 'nest-winston';
import * as morgan from 'morgan';
import * as compression from 'compression';
import { transports } from './configs/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: transports,
    }),
  });

  app.use(
    morgan(
      '\x1b[32m:date[web] :method :status :url :response-time ms --- :res[content-length]',
    ),
  );

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Backend Base API')
    .setDescription('Backend Base API document page')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // end swagger

  app.use(helmet());
  app.use(compression());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        const errorObj = {};
        errors.forEach((err) => {
          if (errorObj[err.property]) {
            errorObj[err.property] = errorObj[err.property].concat(
              Object.values(err.constraints),
            );
          } else {
            errorObj[err.property] = Object.values(err.constraints);
          }
        });

        return new UnprocessableEntityException({ errors: errorObj });
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
