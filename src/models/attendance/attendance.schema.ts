import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from '../common/user.schema';

export type AttendanceDocument = Attendance & Document;

@Schema({ _id: true, timestamps: true })
export class Attendance {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: false })
  user: User | Types.ObjectId;

  @Prop({ type: String, required: false })
  status?: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
