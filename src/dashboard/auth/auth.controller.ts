import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { swagger } from '../../common/constants/swagger.constant';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-admin.dto';

@Controller('dashboard/auth')
@ApiTags(swagger.DashboardAuth)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('admin'))
  @ApiBody({
    type: LoginDto,
  })
  @Post('login')
  async login(@Request() req: Express.Request) {
    return this.authService.login(req.user);
  }
}
