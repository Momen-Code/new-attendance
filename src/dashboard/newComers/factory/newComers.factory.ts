import { Injectable } from '@nestjs/common';
import { CreateNewComersDto } from '../dto/create-newComers.dto';
import { NewComers } from '../entities/newComers.entity';

@Injectable()
export class NewComersFactoryService {
  async createNewNewComers(createNewComersDto: CreateNewComersDto) {
    const newNewComers = new NewComers();

    newNewComers.military_number = createNewComersDto.military_number;
    newNewComers.name = createNewComersDto.name;
    newNewComers.rank = createNewComersDto.rank;
    newNewComers.detachment = createNewComersDto.detachment;

    return newNewComers;
  }

  // updateNewComers(updateNewComersDto: UpdateNewComersDto) {
  //   const newNewComers = new NewComers();

  //   newNewComers.email = updateNewComersDto.email && updateNewComersDto.email;
  //   newNewComers.countryCode =
  //     updateNewComersDto.countryCode && updateNewComersDto.countryCode;
  //   newNewComers.phoneNumber =
  //     updateNewComersDto.phoneNumber && updateNewComersDto.phoneNumber;
  //   newNewComers.gender = updateNewComersDto.gender && updateNewComersDto.gender;
  //   newNewComers.dateOfBirth =
  //     updateNewComersDto.dateOfBirth && updateNewComersDto.dateOfBirth;

  //   return newNewComers;
  // }
}
