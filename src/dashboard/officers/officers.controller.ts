import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import {
  CreateResponse,
  FindAllResponse,
  FindOneResponse,
  RemoveResponse,
  UpdateResponse,
} from 'src/common/dto/response.dto';
import * as xlsx from 'xlsx';
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

  @Post('bulk')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  async registerBulk(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Assuming your service method expects data to be inserted
      const res = await this.officersService.createBulk(jsonData);

      if (!res) {
        throw new BadRequestException('Error while adding bulk users');
      }

      return { message: 'Data inserted successfully' };
    } catch (error) {
      throw error;
    }
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

  @Patch('bulk-status/:status')
  @ApiBearerAuth()
  async updateBulkStatus(@Param('status') status: string) {
    const updateOfficersResponse = new UpdateResponse();
    try {
      const officers = await this.officersService.updateBulkStatus(status);
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
