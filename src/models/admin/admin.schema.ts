import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({
  timestamps: true,
  discriminatorKey: 'type',
})
export class Admin {
  readonly _id?: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
