import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as _ from 'lodash';
import { NewComers, NewComersRepository } from 'src/models';
import { FindAllQueryDto } from './dto/find-all-query.dto.ts.dto';
import { FindAll } from 'src/common/type';

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

  public async findAll(query: FindAllQueryDto): Promise<FindAll<NewComers>> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { limit, page, sort, order, ...rest } = query || {};
    const match = {};

    if (query.military_number) {
      Object.assign(match, {
        military_number: query.military_number,
      });
    }
    if (query.arrive_on) {
      Object.assign(match, {
        arrive_on: +query.arrive_on,
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
        { ...query, paginate: query.paginate },
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

  public async updateBulkStatus(status: string) {
    try {
      return this.newComersRepository.model.updateMany(
        { status },
        { status: status === 'in' ? 'out' : 'in' },
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

  public async findStatistics(query: FindAllQueryDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { limit, page, sort, order, ...rest } = query || {};

    const match = {};

    if (query.date) {
      const startDate = new Date(query.date); // Start of the specified day
      startDate.setHours(0, 0, 0, 0); // Set time to start of day (midnight)

      const endDate = new Date(query.date); // End of the specified day
      endDate.setHours(23, 59, 59, 999); // Set time to end of day (just before midnight)

      Object.assign(match, {
        updatedAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    }
    try {
      const inNewComers: any = await this.newComersRepository.getAll(
        { ...match, is_deleted: false, status: 'in' },
        { ...query, paginate: false },
      );
      const outNewComers: any = await this.newComersRepository.getAll(
        { ...match, is_deleted: false, status: 'out' },
        { ...query, paginate: false },
      );

      return {
        date: query.date ?? new Date(),
        total_newComers_in_camp: inNewComers.length,
        total_newComers_out_camp: outNewComers.length,
      };
    } catch (error) {
      throw error;
    }
  }
}
