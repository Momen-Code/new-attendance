import { Module } from '@nestjs/common';
import { UserModule } from 'src/shared/user.module';
import { SoldierFactoryService } from './factory/soldiers.factory';
import { SoldierController } from './soldiers.controller';
import { SoldierService } from './soldiers.service';

@Module({
  imports: [UserModule],
  controllers: [SoldierController],
  providers: [SoldierService, SoldierFactoryService],
  exports: [SoldierService],
})
export class SoldierModule {}
