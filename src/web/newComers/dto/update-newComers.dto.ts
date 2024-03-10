import { PartialType } from '@nestjs/swagger';
import { CreateNewComersDto } from './create-newComers.dto';

export class UpdateNewComersDto extends PartialType(CreateNewComersDto) {}
