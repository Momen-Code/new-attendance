import { Injectable } from '@nestjs/common';
import { Attendance } from '../entities/attendance.entity';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';

@Injectable()
export class AttendanceFactoryService {
  async createNewAttendance(createAttendanceDto: CreateAttendanceDto) {
    const newAttendance = new Attendance();

    newAttendance.user = createAttendanceDto.user;
    newAttendance.status = createAttendanceDto.status;

    return newAttendance;
  }
}
