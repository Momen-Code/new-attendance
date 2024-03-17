import { Types } from 'mongoose';

export class Soldier {
  readonly _id?: Types.ObjectId;
  military_number: string;
  name: string;
  status: string;
  rank: string;
  last_update_time: string;
  is_deleted?: boolean;
  isActive?: boolean;
}
