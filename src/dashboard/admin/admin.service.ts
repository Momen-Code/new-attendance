import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as _ from 'lodash';
import { Admin, AdminRepository } from 'src/models';

@Injectable()
export class AdminService {
  constructor(private adminRepository: AdminRepository) {}
  private readonly logger = new Logger(AdminService.name);

  public async create(admin: Admin) {
    try {
      const adminExists = await this.adminRepository.exists({
        username: admin.username,
      });
      if (adminExists)
        throw new ConflictException('Admin account already exists');

      await this.adminRepository.create(admin);
      const userCreated = await this.findOne(admin.username);
      if (!userCreated) throw new BadRequestException();
      return { ..._.omit(userCreated, ['password']) } as Admin;
    } catch (error) {
      this.logger.error('--Error--', error);
      throw error;
    }
  }

  public async findOne(username: string) {
    try {
      return this.adminRepository.getOne({
        username,
      });
    } catch (error) {
      throw error;
    }
  }
}
