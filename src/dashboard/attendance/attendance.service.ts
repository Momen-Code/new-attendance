import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Attendance, AttendanceRepository } from 'src/models';
import { genMatch } from '../../common/helper/match-query.helper';
import { FindAllQueryDto } from './dto/find-all-query.dto';

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

  public async findAll(query: FindAllQueryDto) {
    const { limit, skip, sort, paginate, ...rest } = query || {};
    const match = genMatch(rest);
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
            $match: match,
          },
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
        { limit, skip, paginate, sort },
      );
    } catch (error) {
      throw error;
    }
  }
}
