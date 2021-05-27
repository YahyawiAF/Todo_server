import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Field,
  Ctx,
  UseMiddleware,
  InputType,
} from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { isAuth } from "../../types/isAuth";
// import { getMongoRepository } from "typeorm";
import { ToDo } from "../../entity/Todo";
import {TodoInput} from "./TodoInput"


@InputType()
export class CommentToDo {
  @Field()
  idTodo: string;
  @Field()
  comment: string;
}

@Resolver()
export class ToDoResolver {
  @Query(() => [ToDo])
  @UseMiddleware(isAuth)
  async todos(@Ctx() { payload }: MyContext): Promise<any> {
    try {
      return ToDo.find({ user_id: payload!.userId });
    } catch (err) {
      throw new Error("Cannot get todos");
    }
  }

  @Mutation(() => ToDo)
  @UseMiddleware(isAuth)
  async createToDo(
    @Arg("todo") input: TodoInput,
    @Ctx() { payload }: MyContext
  ): Promise<TodoInput> {
    const todo = new ToDo();
    todo.Title = input.Title;
    todo.Description = input.Description;
    todo.IsCompleted = false;
    todo.user_id = payload!.userId;
    await todo.save();
    return todo;
  }
}
