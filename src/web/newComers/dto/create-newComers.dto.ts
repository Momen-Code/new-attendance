import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNewComersDto {
  @ApiProperty()
  @IsString()
  military_number: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  rank: string;

  @ApiProperty()
  @IsString()
  detachment: string;
}
