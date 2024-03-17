import { Module } from '@nestjs/common';
import { AttendanceModule } from './attendance/attendance.module';
import { NewComersModule } from './newComers/newComers.module';
import { OfficersModule } from './officers/officers.module';
import { SoldierModule } from './soldiers/soldiers.module';

@Module({
  imports: [NewComersModule, AttendanceModule, SoldierModule, OfficersModule],
  providers: [],
})
export class WebModule {}
