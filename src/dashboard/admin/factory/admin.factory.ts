import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class AdminFactoryService {
  async createNewAdmin(createAdminDto: CreateAdminDto) {
    const newAdmin = new Admin();

    newAdmin.username = createAdminDto.username;
    newAdmin.password = createAdminDto.password;

    return newAdmin;
  }

  // updateAdmin(updateAdminDto: UpdateAdminDto) {
  //   const newAdmin = new Admin();

  //   newAdmin.email = updateAdminDto.email && updateAdminDto.email;
  //   newAdmin.countryCode =
  //     updateAdminDto.countryCode && updateAdminDto.countryCode;
  //   newAdmin.phoneNumber =
  //     updateAdminDto.phoneNumber && updateAdminDto.phoneNumber;
  //   newAdmin.gender = updateAdminDto.gender && updateAdminDto.gender;
  //   newAdmin.dateOfBirth =
  //     updateAdminDto.dateOfBirth && updateAdminDto.dateOfBirth;

  //   return newAdmin;
  // }
}
