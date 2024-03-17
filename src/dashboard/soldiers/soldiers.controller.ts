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
      console.log(soldier);
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
