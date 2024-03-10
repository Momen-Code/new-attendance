import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FindAllQuery } from 'src/common/dto/findall-query.dto';
import { Attendance, AttendanceRepository } from 'src/models';

@Injectable()
export class AttendanceService {
  constructor(private requestRepository: AttendanceRepository) {}
  private readonly logger = new Logger(AttendanceService.name);

  public async create(request: Attendance) {
    try {
      const requestCreated = await this.requestRepository.create(request);
      if (!requestCreated) {
        throw new BadRequestException('Error creating request');
      }
      return requestCreated;
    } catch (error) {
      this.logger.error('--Error--', error);
      throw error;
    }
  }

  public async findAll(query: FindAllQuery) {
    try {
      return this.requestRepository.getAll({}, query);
    } catch (error) {
      throw error;
    }
  }
}
