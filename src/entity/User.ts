import { Entity, Column, BaseEntity, ObjectIdColumn } from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";

import { ObjectID } from "mongodb";

@Entity("users")
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;


  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column("text", { unique: true })
  email: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column()
  password: string;

  // @OneToMany(() => ToDo, (todo: ToDo) => todo.user, {
  //   onDelete: "CASCADE",
  //   onUpdate: "CASCADE",
  // })
  // todos: Promise<ToDo[]>;
}
