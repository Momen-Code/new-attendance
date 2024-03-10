import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { I18nInterceptor } from './common/interceptor/translation.interceptor';
import configuration from './config/envs';
import { DashboardModule } from './dashboard/dashboard.module';
import { WebModule } from './web/web.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database').url,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    DashboardModule,
    WebModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: I18nInterceptor,
    },
  ],
})
export class AppModule {}
