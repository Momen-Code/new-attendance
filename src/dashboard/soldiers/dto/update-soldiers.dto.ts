import { PartialType } from '@nestjs/swagger';
import { CreateSoldierDto } from './create-soldiers.dto';

export class UpdateSoldierDto extends PartialType(CreateSoldierDto) {}
