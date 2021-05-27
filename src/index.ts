import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import { buildSchema } from "type-graphql";

import { LoginResolver } from "./resolvers/user/login";
import { RegisterResolver } from "./resolvers/user/register";

(async () => {
  const app = express();
  app.use(cookieParser());
  app.get("/", (_req, res) => res.send("hello"));

  //connect to db
  try {
    await createConnection();
  } catch (err) {
    console.log(err);
  }

  const appoloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [LoginResolver, RegisterResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  appoloServer.applyMiddleware({ app });

  app.listen(5000, () => {
    console.log("express server started");
  });
})();
