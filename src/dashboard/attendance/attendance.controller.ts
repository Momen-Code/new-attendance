import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateResponse, FindAllResponse } from 'src/common/dto/response.dto';
import { Attendance } from 'src/models';
import { swagger } from '../../common/constants/swagger.constant';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { AttendanceFactoryService } from './factory/attendance.factory';

@Controller('dashboard/attendance')
@ApiTags(swagger.DashboardAttendance)
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly attendanceFactoryService: AttendanceFactoryService,
  ) {}

  @Public()
  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    const createAttendanceResponse = new CreateResponse<Attendance>();
    try {
      const Attendance =
        await this.attendanceFactoryService.createNewAttendance(
          createAttendanceDto,
        );
      const createdAttendance = await this.attendanceService.create(Attendance);

      createAttendanceResponse.success = true;
      createAttendanceResponse.data = createdAttendance;
    } catch (error) {
      createAttendanceResponse.success = false;
      throw error;
    }
    return createAttendanceResponse;
  }

  @Get()
  @ApiBearerAuth()
  async getAll(@Query() query: FindAllQueryDto) {
    const getAllAttendancesResponse = new FindAllResponse();
    try {
      const attendance = await this.attendanceService.findAll(query);
      getAllAttendancesResponse.success = true;
      getAllAttendancesResponse.data = attendance.data;
      getAllAttendancesResponse.currentPage = attendance.currentPage;
      getAllAttendancesResponse.numberOfPages = attendance.numberOfPages;
      getAllAttendancesResponse.numberOfRecords = attendance.numberOfRecords;
    } catch (error) {
      getAllAttendancesResponse.success = false;
      throw error;
    }
    return getAllAttendancesResponse;
  }
}
