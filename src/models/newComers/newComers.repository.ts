import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { NewComers, NewComersDocument } from './newComers.schema';

export class NewComersRepository extends AbstractRepository<NewComers> {
  constructor(
    @InjectModel(NewComers.name)
    private readonly newComersModel: Model<NewComersDocument>,
  ) {
    super(newComersModel);
  }
}
