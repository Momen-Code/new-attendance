import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Admin,
  AdminRepository,
  AdminSchema,
  NewComers,
  NewComersRepository,
  NewComersSchema,
  Officers,
  OfficersRepository,
  OfficersSchema,
  Soldier,
  SoldierRepository,
  SoldierSchema,
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
          { name: Soldier.name, schema: SoldierSchema },
          { name: Officers.name, schema: OfficersSchema },
        ],
      },
    ]),
  ],
  providers: [
    AdminRepository,
    NewComersRepository,
    SoldierRepository,
    OfficersRepository,
  ],
  exports: [
    AdminRepository,
    NewComersRepository,
    SoldierRepository,
    OfficersRepository,
  ],
})
export class UserModule {}
