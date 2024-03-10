import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum Order {
  'ascending' = 1,
  'descending' = -1,
}

export class FindAllQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number = 0;

  @IsOptional()
  @IsString()
  sort?: string = 'createdAt';

  @IsOptional()
  @IsEnum(Order)
  @Type(() => Number)
  order?: Order = Order.descending;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  paginate?: boolean = true;
}
