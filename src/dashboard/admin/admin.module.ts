import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminRepository, AdminSchema } from 'src/models';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminFactoryService } from './factory/admin.factory';
import { UserModule } from 'src/shared/user.module';

@Module({
  imports: [UserModule],
  controllers: [AdminController],
  providers: [AdminService, AdminFactoryService],
  exports: [AdminService],
})
export class AdminModule {}
