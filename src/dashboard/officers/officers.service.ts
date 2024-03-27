import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as _ from 'lodash';
import { Officers, OfficersRepository } from 'src/models';
import { FindAllQueryDto } from './dto/find-all-query.dto.ts.dto';

@Injectable()
export class OfficersService {
  constructor(private officersRepository: OfficersRepository) {}
  private readonly logger = new Logger(OfficersService.name);

  public async create(officers: Officers) {
    try {
      const officersExists = await this.officersRepository.exists({
        military_number: officers.military_number,
      });
      if (officersExists)
        throw new ConflictException('Officers account already exists');

      await this.officersRepository.create(officers);
      const userCreated = await this.findOne(officers.military_number);
      if (!userCreated) throw new BadRequestException();
      return { ..._.omit(userCreated, ['password']) } as Officers;
    } catch (error) {
      this.logger.error('--Error--', error);
      throw error;
    }
  }

  public async createBulk(data: any) {
    try {
      await this.officersRepository.model.insertMany(data);
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
    try {
      return this.officersRepository.getAll(
        { ...match, is_deleted: false },
        query,
      );
    } catch (error) {
      throw error;
    }
  }

  public async findOne(military_number: string) {
    try {
      return this.officersRepository.getOne({
        military_number,
      });
    } catch (error) {
      throw error;
    }
  }

  public async update(id: string, updatedNewComer: Officers) {
    try {
      return this.officersRepository.update(
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
      return this.officersRepository.model.updateMany(
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
      return this.officersRepository.update(
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
