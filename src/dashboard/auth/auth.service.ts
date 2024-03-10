import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { AdminService } from '../admin/admin.service';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private adminService: AdminService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  public async validateAdmin(username: string, pass: string): Promise<any> {
    const user = await this.adminService.findOne(username);
    if (user && user.password === pass) {
      return { ..._.omit(user, ['password']) };
    }
    return null;
  }

  public login(user: Express.User) {
    try {
      const { _id, username } = user as Admin;
      const payload = {
        _id,
        username,
      };
      return {
        user: payload,
        token: this.signJwt(payload),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public signJwt(payload) {
    return this.jwtService.sign(payload);
  }
}
