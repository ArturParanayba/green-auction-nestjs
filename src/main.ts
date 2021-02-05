import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  InternalServerErrorException,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import * as helmet from 'helmet';
import * as xss from 'xss-clean';
import * as rateLimit from 'express-rate-limit';
import * as hpp from 'hpp';
import * as bodyParser from 'body-parser';
import { port } from './config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap');

    app.enableCors();
    app.use(helmet());
    app.use(xss());
    app.use(hpp());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(
      rateLimit({
        windowMs: 5 * 60 * 1000, // 5min
        max: 1000,
        message: 'too many requests, try again later',
      }),
    );

    // global data validation (class-validator)
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await app.listen(port);
    logger.log(`>_ server running on: http://localhost:${port}/api/v1/grac/`);
  } catch (err) {
    this.logger.error(`error starting server: ${err.message}`);
    throw new InternalServerErrorException(err);
  }
}
bootstrap();
