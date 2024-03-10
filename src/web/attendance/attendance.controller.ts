import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateResponse } from 'src/common/dto/response.dto';
import { Attendance } from 'src/models';
import { swagger } from '../../common/constants/swagger.constant';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceFactoryService } from './factory/attendance.factory';
import { NewComersService } from '../newComers/newComers.service';

@Controller('web/attendance')
@ApiTags(swagger.WebAttendance)
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly newComersService: NewComersService,
    private readonly AttendanceFactoryService: AttendanceFactoryService,
  ) {}

  @Public()
  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    const createAttendanceResponse = new CreateResponse<Attendance>();
    try {
      const Attendance =
        await this.AttendanceFactoryService.createNewAttendance(
          createAttendanceDto,
        );
      const createdAttendance = await this.attendanceService.create(Attendance);
      await this.newComersService.updateStatus(
        createAttendanceDto.user,
        createAttendanceDto.status,
      );
      createAttendanceResponse.success = true;
      createAttendanceResponse.data = createdAttendance;
    } catch (error) {
      createAttendanceResponse.success = false;
      throw error;
    }
    return createAttendanceResponse;
  }
}
