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
import { ToDo } from "../../entity/Todo";
import { Comment } from "../../entity/Comment";
import { TodoInput } from "./TodoInput";
import { getMongoRepository } from "typeorm";

import { ObjectID } from "mongodb";
import { ApolloError } from "apollo-server-express";

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
  ): Promise<ToDo> {
    const todo = new ToDo();
    todo.Title = input.Title;
    todo.Description = input.Description;
    todo.IsCompleted = false;
    todo.user_id = payload!.userId;
    await todo.save();
    return todo;
  }

  @Mutation(() => ToDo)
  @UseMiddleware(isAuth)
  async comment(
    @Arg("idTodo") id: string,
    @Arg("comment") comment: string,
    @Ctx() { payload }: MyContext
  ): Promise<ToDo> {
    const todoRepository = getMongoRepository(ToDo);
    let todo = await todoRepository.findOne(id);

    if (!todo) {
      throw new Error("todo not found");
    }
    let cmt = new Comment(comment, payload!.userId);
    await cmt.save();

    await todoRepository.updateOne({ _id: new ObjectID(id) }, [
      { $set: { Comments: [...todo.Comments, cmt] } },
    ]);
    todo = await todoRepository.findOne(id);
    if (!todo) {
      throw new Error("todo not found");
    }
    return todo;
  }

  @Mutation(() => ToDo)
  @UseMiddleware(isAuth)
  async shareWith(
    @Arg("todId") todId: string,
    @Arg("user") user_id: string,
    @Ctx() { payload }: MyContext
  ): Promise<ToDo> {
    const todoRepository = getMongoRepository(ToDo);
    let todo = await todoRepository.findOne({
      where: {
        _id: { $eq: new ObjectID(todId) },
        user_id: { $eq: payload?.userId },
      },
    });
    if (!todo) {
      throw new Error("todo not found");
    }

    if (todo.shared_with && todo.shared_with.indexOf(user_id) !== -1) {
      throw new ApolloError("Application Error", "APPLICATION_ERROR", {
        applicationError: {
          code: "",
          message: "User already exist",
          description: "",
        },
      });
    }
    await todoRepository.updateOne({ _id: new ObjectID(todId) }, [
      { $set: { shared_with: [user_id] } },
    ]);
    let res = await todoRepository.findOne({
      where: {
        _id: { $eq: new ObjectID(todId) },
        user_id: { $eq: payload?.userId },
      },
    });
    if (!res) {
      throw new ApolloError("Application Error", "APPLICATION_ERROR", {
        applicationError: {
          code: "",
          message: "Error when share Todo with user",
          description: "",
        },
      });
    }
    return res;
  }

  @Mutation(() => ToDo)
  @UseMiddleware(isAuth)
  async updateToDo(
    @Arg("id") id: string,
    @Arg("todo") input: TodoInput,
    @Ctx() { payload }: MyContext
  ): Promise<ToDo> {
    const todoRepository = getMongoRepository(ToDo);
    const todo = await todoRepository.findOne(id);
    if (!todo) {
      throw new Error("todo not found");
    }
    if (payload?.userId !== todo.user_id) {
      throw new Error("user have no authorization");
    }
    if (input.Title) todo.Title = input.Title;
    if (input.Description) todo.Description = input.Description;
    if (input.Description) todo.IsCompleted = input.isCompleted;
    await todoRepository.save(todo);
    return todo;
  }

  @Mutation(() => [ToDo])
  @UseMiddleware(isAuth)
  async deleteToDo(
    @Arg("id") id: string,
    @Ctx() { payload }: MyContext
  ): Promise<ToDo[]> {
    const todoRepository = getMongoRepository(ToDo);
    let todo = await todoRepository.findOne({
      where: {
        _id: { $eq: new ObjectID(id) },
        user_id: { $eq: payload?.userId },
      },
    });
    if (!todo) {
      throw new Error("todo not found");
    }
    if (payload?.userId !== todo.user_id) {
      throw new Error("user have no authorization");
    }
    await todoRepository.delete(id);
    let res = await ToDo.find({ user_id: payload!.userId });
    return res;
  }
}
