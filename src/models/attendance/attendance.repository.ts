import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { Attendance, AttendanceDocument } from './attendance.schema';

export class AttendanceRepository extends AbstractRepository<Attendance> {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,
  ) {
    super(attendanceModel);
  }
}
