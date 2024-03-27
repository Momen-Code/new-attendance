import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOfficersDto {
  @ApiProperty()
  @IsString()
  military_number: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  rank: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;
}
