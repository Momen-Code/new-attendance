import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(
        configService.get('access').ADMIN_PUBLIC_KEY,
        'base64',
      ).toString('ascii'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return {
      _id: payload._id,
      email: payload.email,
      username: payload.username,
      name: payload.name,
    };
  }
}
