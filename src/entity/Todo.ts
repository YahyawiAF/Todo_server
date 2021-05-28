import {
  Entity,
  ObjectIdColumn,
  Column,
  BaseEntity,
  ObjectID as ObjectIDType,
  BeforeInsert,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { Comment } from "./Comment";

@ObjectType()
@Entity()
export class ToDo extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  _id: ObjectIDType;

  @Field({ nullable: true })
  @Column()
  Title: string;

  @Field({ nullable: true })
  @Column()
  Description: string;

  @Field({ nullable: true })
  @Column()
  user_id: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  IsCompleted: boolean;

  @Field(() => [Comment], { defaultValue: [] })
  @Column({ default: [] })
  Comments: Comment[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  @Column({ default: [] })
  shared_with: String[];

  @BeforeInsert()
  beforeInsertActions() {
    this.Comments = [];
    this.shared_with = [];
  }
}
