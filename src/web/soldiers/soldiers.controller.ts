import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateResponse, FindOneResponse } from 'src/common/dto/response.dto';
import { swagger } from '../../common/constants/swagger.constant';
import { Soldier } from '../../models';
import { CreateSoldierDto } from './dto/create-soldiers.dto';
import { SoldierFactoryService } from './factory/soldiers.factory';
import { SoldierService } from './soldiers.service';

@Controller('web/soldiers')
@ApiTags(swagger.WebSoldier)
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

  @Get(':military_number')
  @Public()
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
}
