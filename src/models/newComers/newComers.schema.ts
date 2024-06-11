import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NewComersDocument = NewComers & Document;

@Schema({
  timestamps: true,
  discriminatorKey: 'type',
})
export class NewComers {
  readonly _id?: Types.ObjectId;

  @Prop({ type: String, required: true })
  military_number: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, default: 'out' })
  status: string;

  @Prop({ type: String, required: true, default: 'جندي' })
  rank: string;

  @Prop({ type: String })
  last_update_time: string;

  @Prop({ type: String, default: '1' })
  arrive_on?: string;

  detachment?: string;
  is_deleted?: boolean;
  isActive?: boolean;
}

export const NewComersSchema = SchemaFactory.createForClass(NewComers);
