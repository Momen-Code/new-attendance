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
    const { limit, skip, sort, order, paginate, ...rest } = query || {};

    try {
      return this.requestRepository.aggregate(
        [
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
            },
          },
          { $unwind: '$user' },
          {
            $project: {
              _id: 1,
              status: 1,
              updatedAt: 1,
              user: {
                _id: 1,
                name: 1,
                military_number: 1,
                rank: 1,
                detachment: 1,
              },
            },
          },
        ],
        { limit, skip, paginate, sort, order },
      );
    } catch (error) {
      throw error;
    }
  }
}
