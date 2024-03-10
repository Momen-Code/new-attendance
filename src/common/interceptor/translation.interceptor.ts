import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isNil, isObject } from 'lodash';
import { map, Observable } from 'rxjs';

type ResponseData = {
  data: responseBody | responseBody[];
};

type responseBody = {
  name: string;
  description: string;
  translation: {
    _lang: string;
    name: string;
    description: string;
  };
};

@Injectable()
export class I18nInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const lang = req.headers['locale'];

    if (!lang || lang === 'ar') return next.handle();

    return next
      .handle()
      .pipe(map((res) => (res ? this.applyTranslation(res) : res)));
  }

  private applyTranslation(res: ResponseData) {
    const { data } = res;

    if (isNil(data) && !isObject(data)) {
      return res;
    }

    if (Array.isArray(data)) {
      data.forEach((el) => {
        const translation = el.translation ?? undefined;

        if (translation) {
          el.name ? (el.name = translation.name) : null;
          el.description ? (el.description = translation.description) : null;
        }
      });
    } else {
      const translation = data.translation ?? undefined;

      if (translation) {
        data.name ? (data.name = translation.name) : null;
        data.description ? (data.description = translation.description) : null;
      }
    }

    return res;
  }
}
