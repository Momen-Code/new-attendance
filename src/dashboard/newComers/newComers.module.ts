import { Module } from '@nestjs/common';
import { UserModule } from 'src/shared/user.module';
import { NewComersFactoryService } from './factory/newComers.factory';
import { NewComersController } from './newComers.controller';
import { NewComersService } from './newComers.service';

@Module({
  imports: [UserModule],
  controllers: [NewComersController],
  providers: [NewComersService, NewComersFactoryService],
  exports: [NewComersService],
})
export class NewComersModule {}
