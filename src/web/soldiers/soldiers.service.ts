import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as _ from 'lodash';
import { Types } from 'mongoose';
import { Soldier, SoldierRepository } from 'src/models';

@Injectable()
export class SoldierService {
  constructor(private soldierRepository: SoldierRepository) {}
  private readonly logger = new Logger(SoldierService.name);

  public async create(soldier: Soldier) {
    try {
      const soldierExists = await this.soldierRepository.exists({
        military_number: soldier.military_number,
      });
      if (soldierExists)
        throw new ConflictException('Soldier account already exists');

      await this.soldierRepository.create(soldier);
      const userCreated = await this.findOne(soldier.military_number);
      if (!userCreated) throw new BadRequestException();
      return { ..._.omit(userCreated, ['password']) } as Soldier;
    } catch (error) {
      this.logger.error('--Error--', error);
      throw error;
    }
  }

  public async findOne(military_number: string) {
    try {
      return this.soldierRepository.getOne({
        military_number,
      });
    } catch (error) {
      throw error;
    }
  }

  public async updateStatus(_id: Types.ObjectId, status: string) {
    try {
      return this.soldierRepository.update(
        {
          _id: new Types.ObjectId(_id),
        },
        { status, updatedAt: Date.now() },
        { new: true, lean: true },
      );
    } catch (error) {
      throw error;
    }
  }
}
