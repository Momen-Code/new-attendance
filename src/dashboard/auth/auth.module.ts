import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from '../admin/admin.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './stratigies/jwt.strategy';
import { LocalStrategy } from './stratigies/local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          privateKey: Buffer.from(
            configService.get('access').ADMIN_PRIVATE_KEY,
            'base64',
          ).toString('ascii'),
          publicKey: Buffer.from(
            configService.get('access').ADMIN_PUBLIC_KEY,
            'base64',
          ).toString('ascii'),
          signOptions: {
            expiresIn: '1y',
            algorithm: 'RS256',
          },
        };
      },
    }),
    AdminModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
