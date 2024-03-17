import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  discriminatorKey: 'type',
})
export class User {
  readonly _id?: mongoose.Types.ObjectId;

  @Prop({ type: String, required: false })
  username?: string;

  @Prop({ type: String, required: false })
  password?: string;

  @Prop({ type: String, required: false })
  military_number?: string;

  @Prop({ type: String, required: false })
  name?: string;

  @Prop({ type: String, required: false, default: 'in' })
  status?: string;

  @Prop({ type: String, required: false })
  rank?: string;

  @Prop({ type: String, required: false })
  detachment?: string;

  @Prop({ type: String })
  last_update_time?: string;

  @Prop({ type: Boolean, default: false })
  is_deleted?: boolean;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
