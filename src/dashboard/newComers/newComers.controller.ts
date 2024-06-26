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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import {
  CreateResponse,
  FindAllResponse,
  FindOneResponse,
  RemoveResponse,
  UpdateResponse,
} from 'src/common/dto/response.dto';
import { NewComers } from 'src/models';
import { swagger } from '../../common/constants/swagger.constant';
import { CreateNewComersDto } from './dto/create-newComers.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
import { FindAllQueryDto } from './dto/find-all-query.dto.ts.dto';
import { UpdateNewComersDto } from './dto/update-newComers.dto';
import { NewComersFactoryService } from './factory/newComers.factory';
import { NewComersService } from './newComers.service';
import { FindAll } from 'src/common/type';

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

  // @Post('bulk')
  // @ApiBearerAuth()
  // @UseInterceptors(FileInterceptor('file'))
  // async registerBulk(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new BadRequestException('No file uploaded');
  //   }

  //   try {
  //     const workbook = xlsx.read(file.buffer, { type: 'buffer' });
  //     const sheetName = workbook.SheetNames[0];
  //     const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  //     // Assuming your service method expects data to be inserted
  //     const res = await this.newComersService.createBulk(jsonData);

  //     if (!res) {
  //       throw new BadRequestException('Error while adding bulk users');
  //     }

  //     return { message: 'Data inserted successfully' };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

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
      const worksheet = workbook.Sheets[sheetName];

      // Define the header mappings
      const headerMappings = {
        اسم: 'name',
        ك: 'detachment',
        رتبة: 'rank',
        'الـرقـم الـعســـكري': 'military_number',
        رجوع: 'arrive_on',
        // Add other mappings as needed
      };

      // Extracting the headers dynamically from the first row
      const headers: any = xlsx.utils.sheet_to_json(worksheet, {
        header: 1,
      })[0];
      if (!headers || headers.length === 0) {
        throw new BadRequestException('No headers found in the sheet');
      }

      // Validate if all required headers are present
      for (const requiredHeader in headerMappings) {
        if (!headers.includes(requiredHeader)) {
          throw new BadRequestException(
            `Missing required header: ${requiredHeader}`,
          );
        }
      }

      // Reading the rest of the data as JSON
      const rawData = xlsx.utils.sheet_to_json(worksheet, {
        header: headers,
        defval: null,
      });

      // Map the data based on headerMappings
      const jsonData = rawData.map((row: any) => {
        const mappedRow: any = {};
        for (const [excelHeader, jsonKey] of Object.entries(headerMappings)) {
          mappedRow[jsonKey] = row[excelHeader];
        }
        return mappedRow;
      });

      console.log(jsonData);

      // Insert the data into the database
      const res = await this.newComersService.createBulk(jsonData);

      if (!res) {
        throw new BadRequestException('Error while adding bulk users');
      }

      return { message: 'Data inserted successfully' };
    } catch (error) {
      throw new BadRequestException(`Error processing file: ${error.message}`);
    }
  }

  @Get()
  @ApiBearerAuth()
  async getAll(@Query() query: FindAllQueryDto) {
    const getAllNewComersResponse = new FindAllResponse();
    try {
      const newComers = await this.newComersService.findAll(query);
      getAllNewComersResponse.success = true;
      getAllNewComersResponse.data = newComers.data
        ? newComers.data
        : newComers;
      getAllNewComersResponse.currentPage = newComers.currentPage;
      getAllNewComersResponse.numberOfPages = newComers.numberOfPages;
      getAllNewComersResponse.numberOfRecords = newComers.numberOfRecords;
    } catch (error) {
      getAllNewComersResponse.success = false;
      throw error;
    }
    return getAllNewComersResponse;
  }

  @Get('statistics')
  @ApiBearerAuth()
  async getStatsitics(@Query() query: FindAllQueryDto) {
    const getStatsiticsResponse = new FindOneResponse();
    try {
      const statistics = await this.newComersService.findStatistics(query);
      getStatsiticsResponse.success = true;
      getStatsiticsResponse.data = statistics;
      // getStatsiticsResponse.currentPage = newComers.currentPage;
      // getStatsiticsResponse.numberOfPages = newComers.numberOfPages;
      // getStatsiticsResponse.numberOfRecords = newComers.numberOfRecords;
    } catch (error) {
      getStatsiticsResponse.success = false;
      throw error;
    }
    return getStatsiticsResponse;
  }

  @Get(':military_number')
  @ApiBearerAuth()
  async getOne(@Param('military_number') military_number: string) {
    const getAllNewComersResponse = new FindOneResponse();
    try {
      const newComers = await this.newComersService.findOne(military_number);
      getAllNewComersResponse.success = true;
      getAllNewComersResponse.data = newComers;
    } catch (error) {
      getAllNewComersResponse.success = false;
      throw error;
    }
    return getAllNewComersResponse;
  }

  @Patch(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateNewComersDto: UpdateNewComersDto,
  ) {
    const updateNewComersResponse = new UpdateResponse();
    try {
      const updateNewComer =
        await this.newComersFactoryService.updateNewNewComer(
          updateNewComersDto,
        );
      const newComers = await this.newComersService.update(id, updateNewComer);
      updateNewComersResponse.success = true;
      updateNewComersResponse.data = newComers;
    } catch (error) {
      updateNewComersResponse.success = false;
      throw error;
    }
    return updateNewComersResponse;
  }

  @Patch('bulk-status/:status')
  @ApiBearerAuth()
  async updateBulkStatus(@Param('status') status: string) {
    const updateNewComersResponse = new UpdateResponse();
    try {
      const newComers = await this.newComersService.updateBulkStatus(status);
      updateNewComersResponse.success = true;
      updateNewComersResponse.data = newComers;
    } catch (error) {
      updateNewComersResponse.success = false;
      throw error;
    }
    return updateNewComersResponse;
  }

  @Delete(':id')
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    const deleteNewComerResponse = new RemoveResponse();
    try {
      const deletedNewComer = await this.newComersService.delete(id);
      if (deletedNewComer) {
        deleteNewComerResponse.success = true;
      }
    } catch (error) {
      deleteNewComerResponse.success = false;
      throw error;
    }
  }
}
