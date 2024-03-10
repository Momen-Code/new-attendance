import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import * as _ from 'lodash';
import { FindAllQuery } from 'src/common/dto/findall-query.dto';
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

  public async findAll(query: FindAllQuery) {
    try {
      return this.newComersRepository.getAll({}, query);
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
}
