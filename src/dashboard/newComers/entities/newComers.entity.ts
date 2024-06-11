import { Types } from 'mongoose';

export class NewComers {
  readonly _id?: Types.ObjectId;
  military_number: string;
  name: string;
  status: string;
  rank: string;
  last_update_time: string;
  detachment?: string;
  is_deleted?: boolean;
  isActive?: boolean;
  arrive_on?: number;
}
