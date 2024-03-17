import { Injectable } from '@nestjs/common';
import { CreateNewComersDto } from '../dto/create-newComers.dto';
import { UpdateNewComersDto } from '../dto/update-newComers.dto';
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

  async updateNewNewComer(updateNewComersDto: UpdateNewComersDto) {
    const updatedNewComer = new NewComers();

    updatedNewComer.military_number = updateNewComersDto.military_number;
    updatedNewComer.name = updateNewComersDto.name;
    updatedNewComer.rank = updateNewComersDto.rank;
    updatedNewComer.detachment = updateNewComersDto.detachment;

    return updatedNewComer;
  }
}
