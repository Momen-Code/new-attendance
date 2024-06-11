import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { FindAllQuery } from '../../../common/dto/findall-query.dto';

export class FindAllQueryDto extends FindAllQuery {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  military_number?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  detachment?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  arrive_on?: string;
}
