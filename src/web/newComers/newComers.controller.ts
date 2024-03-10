import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateResponse, FindOneResponse } from 'src/common/dto/response.dto';
import { NewComers } from 'src/models';
import { swagger } from '../../common/constants/swagger.constant';
import { CreateNewComersDto } from './dto/create-newComers.dto';
import { NewComersFactoryService } from './factory/newComers.factory';
import { NewComersService } from './newComers.service';

@Controller('web/newComers')
@ApiTags(swagger.WebNewComers)
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

  @Get(':military_number')
  @Public()
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
