import { LoginResolver } from "../resolvers/user/login";
import { RegisterResolver } from "../resolvers/user/register";
import { ToDoResolver } from "../resolvers/todo/TodoResolvers";

import { buildSchema } from "type-graphql";

export const createSchema = () =>
  buildSchema({
    resolvers: [LoginResolver, RegisterResolver, ToDoResolver],
  });
