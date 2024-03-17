import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendance, AttendanceRepository, AttendanceSchema } from 'src/models';
import { NewComersModule } from '../newComers/newComers.module';
import { SoldierModule } from '../soldiers/soldiers.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceFactoryService } from './factory/attendance.factory';
import { OfficersModule } from '../officers/officers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Attendance.name,
        schema: AttendanceSchema,
      },
    ]),
    NewComersModule,
    SoldierModule,
    OfficersModule,
  ],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    AttendanceRepository,
    AttendanceFactoryService,
  ],
  exports: [AttendanceService],
})
export class AttendanceModule {}
