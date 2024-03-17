import { Injectable } from '@nestjs/common';
import { CreateSoldierDto } from '../dto/create-soldiers.dto';
import { UpdateSoldierDto } from '../dto/update-soldiers.dto';
import { Soldier } from '../entities/soldiers.entity';

@Injectable()
export class SoldierFactoryService {
  async createNewSoldier(createSoldierDto: CreateSoldierDto) {
    const newSoldier = new Soldier();

    newSoldier.military_number = createSoldierDto.military_number;
    newSoldier.name = createSoldierDto.name;
    newSoldier.rank = createSoldierDto.rank;

    return newSoldier;
  }

  async updateNewNewComer(updateSoldierDto: UpdateSoldierDto) {
    const updatedNewComer = new Soldier();

    updatedNewComer.military_number = updateSoldierDto.military_number;
    updatedNewComer.name = updateSoldierDto.name;
    updatedNewComer.rank = updateSoldierDto.rank;

    return updatedNewComer;
  }
}
