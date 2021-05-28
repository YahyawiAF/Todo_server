import {
  BaseEntity,
  Column,
  Entity,
  ObjectIdColumn,
  ObjectID as ObjectIDType,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { IsString, MaxLength } from "class-validator";

@Entity("comments")
@ObjectType()
export class Comment extends BaseEntity {
  constructor(text: string, user_id: string) {
    super();
    this.text = text;
    this.user_id = user_id;
  }

  @Field(() => ID)
  @ObjectIdColumn()
  _id: ObjectIDType;

  @Field(() => String)
  @Column()
  @IsString()
  @MaxLength(128)
  text: string;

  @Field(() => String)
  @Column()
  @IsString()
  user_id: string;
}
