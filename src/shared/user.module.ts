import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Admin,
  AdminRepository,
  AdminSchema,
  NewComers,
  NewComersRepository,
  NewComersSchema,
} from 'src/models';
import { User, UserSchema } from 'src/models/common/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [
          { name: Admin.name, schema: AdminSchema },
          { name: NewComers.name, schema: NewComersSchema },
        ],
      },
    ]),
  ],
  providers: [AdminRepository, NewComersRepository],
  exports: [AdminRepository, NewComersRepository],
})
export class UserModule {}
