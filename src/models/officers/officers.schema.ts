import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OfficersDocument = Officers & Document;

@Schema({
  timestamps: true,
  discriminatorKey: 'type',
})
export class Officers {
  readonly _id?: Types.ObjectId;

  @Prop({ type: String, required: true })
  military_number: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  status: string;

  @Prop({ type: String, required: true })
  rank: string;

  @Prop({ type: String })
  last_update_time: string;

  is_deleted?: boolean;
  isActive?: boolean;
}

export const OfficersSchema = SchemaFactory.createForClass(Officers);
