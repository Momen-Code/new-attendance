import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AdminJwtAuth } from 'src/common/guards/admin-auth.guard';
import { AdminModule } from './admin/admin.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { NewComersModule } from './newComers/newComers.module';
import { SoldierModule } from './soldiers/soldiers.module';
import { OfficersModule } from './officers/officers.module';

@Module({
  imports: [
    AdminModule,
    AttendanceModule,
    AuthModule,
    NewComersModule,
    SoldierModule,
    OfficersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminJwtAuth,
    },
  ],
})
export class DashboardModule {}
