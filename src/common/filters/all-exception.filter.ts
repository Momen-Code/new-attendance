import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
// import { NODE_ENV } from '../constants/env.constant';

interface ErrorResponse {
  statusCode: number;
  message: string;
  path?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor(private configService: ConfigService) {
    this.logger = new Logger(AllExceptionsFilter.name);
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest<Request>();

    let error = exception;

    if (!(error instanceof HttpException)) {
      error = new InternalServerErrorException();
    }

    const response: ErrorResponse = {
      statusCode: error.getStatus(),
      message: error.response.message,
    };

    // const nodeEnv = this.configService.env;
    // if (nodeEnv !== NodeEnvValues.prod) {
    //     response.path = req.url;
    // }

    // if (nodeEnv === NodeEnvValues.dev) {
    this.logger.error(exception.toString());
    console.error(exception);
    // }

    res.status(response.statusCode).json(response);
  }
}
