import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateResponse, FindOneResponse } from 'src/common/dto/response.dto';
import { swagger } from '../../common/constants/swagger.constant';
import { Officers } from '../../models';
import { CreateOfficersDto } from './dto/create-officers.dto';
import { OfficersFactoryService } from './factory/officers.factory';
import { OfficersService } from './officers.service';

@Controller('web/officers')
@ApiTags(swagger.WebOfficers)
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

  @Get(':name')
  @Public()
  async getOne(@Param('name') name: string) {
    const getAllOfficersResponse = new FindOneResponse();
    try {
      const officers = await this.officersService.findOne(name);

      getAllOfficersResponse.success = true;
      getAllOfficersResponse.data = officers;
    } catch (error) {
      getAllOfficersResponse.success = false;
      throw error;
    }
    return getAllOfficersResponse;
  }
}
