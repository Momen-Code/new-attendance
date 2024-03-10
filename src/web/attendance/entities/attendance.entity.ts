import { Types } from 'mongoose';
import { User } from 'src/models/common/user.schema';

export class Attendance {
  readonly _id?: Types.ObjectId;
  user: User | Types.ObjectId;
  status: string;
}
