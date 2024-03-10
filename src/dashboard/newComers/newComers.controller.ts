import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import {
  CreateResponse,
  FindAllResponse,
  FindOneResponse,
} from 'src/common/dto/response.dto';
import { NewComers } from 'src/models';
import { swagger } from '../../common/constants/swagger.constant';
import { CreateNewComersDto } from './dto/create-newComers.dto';
import { NewComersFactoryService } from './factory/newComers.factory';
import { NewComersService } from './newComers.service';
import { FindAllQuery } from 'src/common/dto/findall-query.dto';

@Controller('dashboard/newComers')
@ApiTags(swagger.DashboardNewComers)
export class NewComersController {
  constructor(
    private readonly newComersService: NewComersService,
    private readonly newComersFactoryService: NewComersFactoryService,
  ) {}

  @Public()
  @Post()
  async register(@Body() createNewComersDto: CreateNewComersDto) {
    const createNewComersResponse = new CreateResponse<NewComers>();
    try {
      const NewComers =
        await this.newComersFactoryService.createNewNewComers(
          createNewComersDto,
        );
      const createdNewComers = await this.newComersService.create(NewComers);

      createNewComersResponse.success = true;
      createNewComersResponse.data = createdNewComers;
    } catch (error) {
      createNewComersResponse.success = false;
      throw error;
    }
    return createNewComersResponse;
  }

  @Get()
  @ApiBearerAuth()
  async getAll(@Query() query: FindAllQuery) {
    const getAllNewComersRepsonse = new FindAllResponse();
    try {
      const newComers = await this.newComersService.findAll(query);
      getAllNewComersRepsonse.success = true;
      getAllNewComersRepsonse.data = newComers.data;
      getAllNewComersRepsonse.currentPage = newComers.currentPage;
      getAllNewComersRepsonse.numberOfPages = newComers.numberOfPages;
      getAllNewComersRepsonse.numberOfRecords = newComers.numberOfRecords;
    } catch (error) {
      getAllNewComersRepsonse.success = false;
      throw error;
    }
    return getAllNewComersRepsonse;
  }

  @Get('find')
  @ApiBearerAuth()
  async getOne(@Param('military_number') military_number: string) {
    const getAllNewComersRepsonse = new FindOneResponse();
    try {
      const newComers = await this.newComersService.findOne(military_number);
      getAllNewComersRepsonse.success = true;
      getAllNewComersRepsonse.data = newComers;
    } catch (error) {
      getAllNewComersRepsonse.success = false;
      throw error;
    }
    return getAllNewComersRepsonse;
  }
}
