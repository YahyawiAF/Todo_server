import { IsBoolean, Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class TodoInput {
  @Field({ nullable: true })
  @Length(1, 100)
  Title: string;

  @Field({ nullable: true })
  @Length(1, 255)
  Description: string;

  @Field({ nullable: true })
  @IsBoolean()
  isCompleted: boolean;
}
