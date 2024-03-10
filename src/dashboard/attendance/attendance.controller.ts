import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { FindAllQuery } from 'src/common/dto/findall-query.dto';
import { CreateResponse, FindAllResponse } from 'src/common/dto/response.dto';
import { Attendance } from 'src/models';
import { swagger } from '../../common/constants/swagger.constant';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceFactoryService } from './factory/attendance.factory';

@Controller('dashboard/attendance')
@ApiTags(swagger.DashboardAttendance)
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
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
  async getAll(@Query() query: FindAllQuery) {
    const getAllAttendancesRepsonse = new FindAllResponse();
    try {
      const attendance = await this.attendanceService.findAll(query);
      getAllAttendancesRepsonse.success = true;
      getAllAttendancesRepsonse.data = attendance.data;
      getAllAttendancesRepsonse.currentPage = attendance.currentPage;
      getAllAttendancesRepsonse.numberOfPages = attendance.numberOfPages;
      getAllAttendancesRepsonse.numberOfRecords = attendance.numberOfRecords;
    } catch (error) {
      getAllAttendancesRepsonse.success = false;
      throw error;
    }
    return getAllAttendancesRepsonse;
  }
}
