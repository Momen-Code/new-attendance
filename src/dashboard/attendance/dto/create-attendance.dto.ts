import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAttendanceDto {
  @ApiProperty()
  @IsMongoId()
  user: Types.ObjectId;

  @ApiProperty()
  @IsString()
  status: string;
}
