import { PartialType } from '@nestjs/swagger';
import { CreateOfficersDto } from './create-officers.dto';

export class UpdateOfficersDto extends PartialType(CreateOfficersDto) {}
