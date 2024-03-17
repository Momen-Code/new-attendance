import { Injectable } from '@nestjs/common';
import { CreateOfficersDto } from '../dto/create-officers.dto';
import { UpdateOfficersDto } from '../dto/update-officers.dto';
import { Officers } from '../entities/officers.entity';

@Injectable()
export class OfficersFactoryService {
  async createNewOfficers(createOfficersDto: CreateOfficersDto) {
    const newOfficers = new Officers();

    newOfficers.military_number = createOfficersDto.military_number;
    newOfficers.name = createOfficersDto.name;
    newOfficers.rank = createOfficersDto.rank;

    return newOfficers;
  }

  async updateNewNewComer(updateOfficersDto: UpdateOfficersDto) {
    const updatedNewComer = new Officers();

    updatedNewComer.military_number = updateOfficersDto.military_number;
    updatedNewComer.name = updateOfficersDto.name;
    updatedNewComer.rank = updateOfficersDto.rank;

    return updatedNewComer;
  }
}
