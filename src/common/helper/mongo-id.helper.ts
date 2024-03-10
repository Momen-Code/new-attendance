import { BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';

export function toMongoObjectId({ value, key }): mongoose.Types.ObjectId {
  if (
    mongoose.Types.ObjectId.isValid(value) &&
    new mongoose.Types.ObjectId(value).toString() === value
  ) {
    return new mongoose.Types.ObjectId(value);
  } else {
    throw new BadRequestException(`${key} is not a valid MongoId`);
  }
}
