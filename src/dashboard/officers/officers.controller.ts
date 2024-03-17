import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import {
  CreateResponse,
  FindAllResponse,
  FindOneResponse,
  RemoveResponse,
  UpdateResponse,
} from 'src/common/dto/response.dto';
import { swagger } from '../../common/constants/swagger.constant';
import { Officers } from '../../models';
import { CreateOfficersDto } from './dto/create-officers.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto.ts.dto';
import { UpdateOfficersDto } from './dto/update-officers.dto';
import { OfficersFactoryService } from './factory/officers.factory';
import { OfficersService } from './officers.service';

@Controller('dashboard/officers')
@ApiTags(swagger.DashboardOfficers)
export class OfficersController {
  constructor(
    private readonly officersService: OfficersService,
    private readonly officersFactoryService: OfficersFactoryService,
  ) {}

  @Public()
  @Post()
  async register(@Body() createOfficersDto: CreateOfficersDto) {
    const createOfficersResponse = new CreateResponse<Officers>();
    try {
      const Officers =
        await this.officersFactoryService.createNewOfficers(createOfficersDto);
      const createdOfficers = await this.officersService.create(Officers);

      createOfficersResponse.success = true;
      createOfficersResponse.data = createdOfficers;
    } catch (error) {
      createOfficersResponse.success = false;
      throw error;
    }
    return createOfficersResponse;
  }

  @Get()
  @ApiBearerAuth()
  async getAll(@Query() query: FindAllQueryDto) {
    const getAllOfficersResponse = new FindAllResponse();
    try {
      const officers = await this.officersService.findAll(query);
      getAllOfficersResponse.success = true;
      getAllOfficersResponse.data = officers.data;
      getAllOfficersResponse.currentPage = officers.currentPage;
      getAllOfficersResponse.numberOfPages = officers.numberOfPages;
      getAllOfficersResponse.numberOfRecords = officers.numberOfRecords;
    } catch (error) {
      getAllOfficersResponse.success = false;
      throw error;
    }
    return getAllOfficersResponse;
  }

  @Get(':military_number')
  @ApiBearerAuth()
  async getOne(@Param('military_number') military_number: string) {
    const getAllOfficersResponse = new FindOneResponse();
    try {
      const officers = await this.officersService.findOne(military_number);
      console.log(officers);
      getAllOfficersResponse.success = true;
      getAllOfficersResponse.data = officers;
    } catch (error) {
      getAllOfficersResponse.success = false;
      throw error;
    }
    return getAllOfficersResponse;
  }

  @Patch(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateOfficersDto: UpdateOfficersDto,
  ) {
    const updateOfficersResponse = new UpdateResponse();
    try {
      const updateNewComer =
        await this.officersFactoryService.updateNewNewComer(updateOfficersDto);
      const officers = await this.officersService.update(id, updateNewComer);
      updateOfficersResponse.success = true;
      updateOfficersResponse.data = officers;
    } catch (error) {
      updateOfficersResponse.success = false;
      throw error;
    }
    return updateOfficersResponse;
  }

  @Delete(':id')
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    const deleteNewComerResponse = new RemoveResponse();
    try {
      const deletedNewComer = await this.officersService.delete(id);
      if (deletedNewComer) {
        deleteNewComerResponse.success = true;
      }
    } catch (error) {
      deleteNewComerResponse.success = false;
      throw error;
    }
  }
}
