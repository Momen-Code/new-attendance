import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsMongoId()
  user: Types.ObjectId;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  type?: string;
}
