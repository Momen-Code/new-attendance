import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { Soldier, SoldierDocument } from './soldier.schema';

export class SoldierRepository extends AbstractRepository<Soldier> {
  constructor(
    @InjectModel(Soldier.name)
    private readonly soldierModel: Model<SoldierDocument>,
  ) {
    super(soldierModel);
  }
}
