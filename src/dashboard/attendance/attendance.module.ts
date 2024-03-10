import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendance, AttendanceRepository, AttendanceSchema } from 'src/models';
import { AttendanceFactoryService } from './factory/attendance.factory';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { NewComersModule } from '../newComers/newComers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Attendance.name,
        schema: AttendanceSchema,
      },
    ]),
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
