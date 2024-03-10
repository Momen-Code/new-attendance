import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateResponse } from 'src/common/dto/response.dto';
import { Admin } from 'src/models';
import { swagger } from '../../common/constants/swagger.constant';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminFactoryService } from './factory/admin.factory';

@Controller('dashboard/admin')
@ApiTags(swagger.Dashboard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminFactoryService: AdminFactoryService,
  ) {}

  @Public()
  @Post()
  async register(@Body() createAdminDto: CreateAdminDto) {
    const createAdminResponse = new CreateResponse<Admin>();
    try {
      const Admin =
        await this.adminFactoryService.createNewAdmin(createAdminDto);
      const createdAdmin = await this.adminService.create(Admin);

      createAdminResponse.success = true;
      createAdminResponse.data = createdAdmin;
    } catch (error) {
      createAdminResponse.success = false;
      throw error;
    }
    return createAdminResponse;
  }
}
