import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AdminJwtAuth } from 'src/common/guards/admin-auth.guard';
import { NewComersModule } from './newComers/newComers.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [NewComersModule, AttendanceModule],
  providers: [],
})
export class WebModule {}
