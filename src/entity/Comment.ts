import {
  BaseEntity,
  Column,
  Entity,
  ObjectIdColumn,
  ObjectID as ObjectIDType,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { IsString, MaxLength } from "class-validator";
import { User } from "./User";

@Entity("comments")
@ObjectType()
export class Comment extends BaseEntity {
  constructor(text: string, user: User) {
    super();
    this.text = text;
    this.user = user;
  }

  @Field(() => ID)
  @ObjectIdColumn()
  _id: ObjectIDType;

  @Field(() => String)
  @Column()
  @IsString()
  @MaxLength(128)
  text: string;

  @Field(() => User)
  @Column()
  @IsString()
  user: User;
}
