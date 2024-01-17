import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserStatus } from './user.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../enums/role.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @ApiProperty({ type: String })
  _id: string | ObjectId;

  @ApiProperty()
  @Prop({ index: true, unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @ApiProperty({ enum: UserStatus })
  @Prop({ required: true, enum: UserStatus, default: UserStatus.inactive })
  status: UserStatus;

  @ApiProperty({ enum: Role, isArray: true })
  @Prop({ required: true })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (this.isModified('email') || this.isNew) {
    // @ts-ignore
    user.email = user.email.toLowerCase();
  }

  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);

    // @ts-ignore
    user.password = await bcrypt.hash(user.password, salt);
  }

  return next();
});

UserSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret['password'];
    delete ret['__v'];
    return ret;
  },
});
