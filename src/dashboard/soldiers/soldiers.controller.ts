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
import { Soldier } from '../../models';
import { CreateSoldierDto } from './dto/create-soldiers.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto.ts.dto';
import { UpdateSoldierDto } from './dto/update-soldiers.dto';
import { SoldierFactoryService } from './factory/soldiers.factory';
import { SoldierService } from './soldiers.service';

@Controller('dashboard/soldiers')
@ApiTags(swagger.DashboardSoldier)
export class SoldierController {
  constructor(
    private readonly soldierService: SoldierService,
    private readonly soldierFactoryService: SoldierFactoryService,
  ) {}

  @Public()
  @Post()
  async register(@Body() createSoldierDto: CreateSoldierDto) {
    const createSoldierResponse = new CreateResponse<Soldier>();
    try {
      const Soldier =
        await this.soldierFactoryService.createNewSoldier(createSoldierDto);
      const createdSoldier = await this.soldierService.create(Soldier);

      createSoldierResponse.success = true;
      createSoldierResponse.data = createdSoldier;
    } catch (error) {
      createSoldierResponse.success = false;
      throw error;
    }
    return createSoldierResponse;
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
      const res = await this.soldierService.createBulk(jsonData);

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
    const getAllSoldierResponse = new FindAllResponse();
    try {
      const soldier = await this.soldierService.findAll(query);
      getAllSoldierResponse.success = true;
      getAllSoldierResponse.data = soldier.data;
      getAllSoldierResponse.currentPage = soldier.currentPage;
      getAllSoldierResponse.numberOfPages = soldier.numberOfPages;
      getAllSoldierResponse.numberOfRecords = soldier.numberOfRecords;
    } catch (error) {
      getAllSoldierResponse.success = false;
      throw error;
    }
    return getAllSoldierResponse;
  }

  @Get(':military_number')
  @ApiBearerAuth()
  async getOne(@Param('military_number') military_number: string) {
    const getAllSoldierResponse = new FindOneResponse();
    try {
      const soldier = await this.soldierService.findOne(military_number);
      getAllSoldierResponse.success = true;
      getAllSoldierResponse.data = soldier;
    } catch (error) {
      getAllSoldierResponse.success = false;
      throw error;
    }
    return getAllSoldierResponse;
  }

  @Patch(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateSoldierDto: UpdateSoldierDto,
  ) {
    const updateSoldierResponse = new UpdateResponse();
    try {
      const updateNewComer =
        await this.soldierFactoryService.updateNewNewComer(updateSoldierDto);
      const soldier = await this.soldierService.update(id, updateNewComer);
      updateSoldierResponse.success = true;
      updateSoldierResponse.data = soldier;
    } catch (error) {
      updateSoldierResponse.success = false;
      throw error;
    }
    return updateSoldierResponse;
  }

  @Patch('bulk-status/:status')
  @ApiBearerAuth()
  async updateBulkStatus(@Param('status') status: string) {
    const updateSoldiersResponse = new UpdateResponse();
    try {
      const soldiers = await this.soldierService.updateBulkStatus(status);
      updateSoldiersResponse.success = true;
      updateSoldiersResponse.data = soldiers;
    } catch (error) {
      updateSoldiersResponse.success = false;
      throw error;
    }
    return updateSoldiersResponse;
  }

  @Delete(':id')
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    const deleteNewComerResponse = new RemoveResponse();
    try {
      const deletedNewComer = await this.soldierService.delete(id);
      if (deletedNewComer) {
        deleteNewComerResponse.success = true;
      }
    } catch (error) {
      deleteNewComerResponse.success = false;
      throw error;
    }
  }
}
