import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as _ from 'lodash';
import { Soldier, SoldierRepository } from 'src/models';
import { FindAllQueryDto } from './dto/find-all-query.dto.ts.dto';

@Injectable()
export class SoldierService {
  constructor(private soldiersRepository: SoldierRepository) {}
  private readonly logger = new Logger(SoldierService.name);

  public async create(soldiers: Soldier) {
    try {
      const soldiersExists = await this.soldiersRepository.exists({
        military_number: soldiers.military_number,
      });
      if (soldiersExists)
        throw new ConflictException('Soldier account already exists');

      await this.soldiersRepository.create(soldiers);
      const userCreated = await this.findOne(soldiers.military_number);
      if (!userCreated) throw new BadRequestException();
      return { ..._.omit(userCreated, ['password']) } as Soldier;
    } catch (error) {
      this.logger.error('--Error--', error);
      throw error;
    }
  }

  public async findAll(query: FindAllQueryDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { limit, skip, sort, order, paginate, ...rest } = query || {};
    const match = {};

    if (query.military_number) {
      Object.assign(match, {
        military_number: query.military_number,
      });
    }
    if (query.name) {
      Object.assign(match, {
        name: {
          $in: query.name.split(' ').map((s) => new RegExp(s, 'i')),
        },
      });
    }
    if (query.status) {
      Object.assign(match, {
        status: query.status,
      });
    }
    try {
      return this.soldiersRepository.getAll(
        { ...match, is_deleted: false },
        query,
      );
    } catch (error) {
      throw error;
    }
  }

  public async findOne(military_number: string) {
    try {
      return this.soldiersRepository.getOne({
        military_number,
      });
    } catch (error) {
      throw error;
    }
  }

  public async update(id: string, updatedNewComer: Soldier) {
    try {
      return this.soldiersRepository.update(
        { military_number: id },
        updatedNewComer,
        {
          new: true,
          lean: true,
        },
      );
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string) {
    try {
      return this.soldiersRepository.update(
        { _id: id },
        { is_deleted: true },
        {
          new: true,
          lean: true,
        },
      );
    } catch (error) {
      throw error;
    }
  }
}
