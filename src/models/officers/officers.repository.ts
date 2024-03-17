import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { Officers, OfficersDocument } from './officers.schema';

export class OfficersRepository extends AbstractRepository<Officers> {
  constructor(
    @InjectModel(Officers.name)
    private readonly officersModel: Model<OfficersDocument>,
  ) {
    super(officersModel);
  }
}
