import { Types } from 'mongoose';

export class Admin {
  readonly _id?: Types.ObjectId;
  username: string;
  password: string;
}
