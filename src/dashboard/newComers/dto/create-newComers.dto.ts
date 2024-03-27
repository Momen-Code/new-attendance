import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
}
