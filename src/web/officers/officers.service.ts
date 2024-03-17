import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as _ from 'lodash';
import { Types } from 'mongoose';
import { Officers, OfficersRepository } from 'src/models';

@Injectable()
export class OfficersService {
  constructor(private officersRepository: OfficersRepository) {}
  private readonly logger = new Logger(OfficersService.name);

  public async create(officers: Officers) {
    try {
      const officersExists = await this.officersRepository.exists({
        name: officers.name,
      });
      if (officersExists)
        throw new ConflictException('Officers account already exists');

      await this.officersRepository.create(officers);
      const userCreated = await this.findOne(officers.name);
      if (!userCreated) throw new BadRequestException();
      return { ..._.omit(userCreated, ['password']) } as Officers;
    } catch (error) {
      this.logger.error('--Error--', error);
      throw error;
    }
  }

  public async findOne(name: string) {
    try {
      return this.officersRepository.getOne({
        name: {
          $in: name.split(' ').map((s) => new RegExp(s, 'i')),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async updateStatus(_id: Types.ObjectId, status: string) {
    try {
      return this.officersRepository.update(
        {
          _id: new Types.ObjectId(_id),
        },
        { status },
        { new: true, lean: true },
      );
    } catch (error) {
      throw error;
    }
  }
}
