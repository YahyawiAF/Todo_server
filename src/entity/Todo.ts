import { Entity, ObjectIdColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
// import { User } from "./User";

import { ObjectID } from "mongodb";

@ObjectType()
@Entity()
export class ToDo extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

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

}
