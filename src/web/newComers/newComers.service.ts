import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as _ from 'lodash';
import { Types } from 'mongoose';
import { NewComers, NewComersRepository } from 'src/models';

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

  public async findOne(military_number: string) {
    try {
      const newComer = await this.newComersRepository.getOne({
        military_number,
      });

      return newComer;
    } catch (error) {
      throw error;
    }
  }

  public async updateStatus(_id: Types.ObjectId, status: string) {
    try {
      return this.newComersRepository.update(
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
