import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as _ from 'lodash';
import { NewComers, NewComersRepository } from 'src/models';
import { FindAllQueryDto } from './dto/find-all-query.dto.ts.dto';

@Injectable()
export class NewComersService {
  constructor(private newComersRepository: NewComersRepository) {}
  private readonly logger = new Logger(NewComersService.name);

  public async create(newComers: NewComers) {
    try {
      const newComersExists = await this.newComersRepository.exists({
        military_number: newComers.military_number,
      });
      if (newComersExists)
        throw new ConflictException('NewComers account already exists');

      await this.newComersRepository.create(newComers);
      const userCreated = await this.findOne(newComers.military_number);
      if (!userCreated) throw new BadRequestException();
      return { ..._.omit(userCreated, ['password']) } as NewComers;
    } catch (error) {
      this.logger.error('--Error--', error);
      throw error;
    }
  }

  public async createBulk(data: any) {
    try {
      await this.newComersRepository.model.insertMany(data);
      return true;
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
    if (query.detachment) {
      Object.assign(match, {
        detachment: query.detachment,
      });
    }
    try {
      return this.newComersRepository.getAll(
        { ...match, is_deleted: false },
        query,
      );
    } catch (error) {
      throw error;
    }
  }

  public async findOne(military_number: string) {
    try {
      return this.newComersRepository.getOne({
        military_number,
      });
    } catch (error) {
      throw error;
    }
  }

  public async update(id: string, updatedNewComer: NewComers) {
    try {
      return this.newComersRepository.update(
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
      return this.newComersRepository.update(
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
