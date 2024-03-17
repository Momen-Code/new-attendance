import { Module } from '@nestjs/common';
import { UserModule } from 'src/shared/user.module';
import { OfficersFactoryService } from './factory/officers.factory';
import { OfficersController } from './officers.controller';
import { OfficersService } from './officers.service';

@Module({
  imports: [UserModule],
  controllers: [OfficersController],
  providers: [OfficersService, OfficersFactoryService],
  exports: [OfficersService],
})
export class OfficersModule {}
