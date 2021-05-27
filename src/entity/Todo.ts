import {
  Entity,
  ObjectIdColumn,
  Column,
  BaseEntity,
  ObjectID as ObjectIDType,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

// import { User } from "./User";

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

  // @Field(() => [String], { nullable: true, defaultValue: [] })
  // @Column({ default: [] })
  // shared_by: String[];

  // @Field(() => Comments, { nullable: true })
  // @Column()
  // comment: Comments[];
}
