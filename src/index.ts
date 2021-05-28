import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import { buildSchema } from "type-graphql";
import { verify } from "jsonwebtoken";

import { LoginResolver } from "./resolvers/user/login";
import { RegisterResolver } from "./resolvers/user/register";
import { ToDoResolver } from "./resolvers/todo/TodoResolvers";
import {
  createRefreshToken,
  sendRefreshToken,
  createAccessToken,
} from "./types/auth";

import { User } from "./entity/User";
import { ObjectID } from "mongodb";

(async () => {
  const app = express();
  app.use(cookieParser());
  app.get("/", (_req, res) => res.send("hello"));
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }
    const user = await User.findOne({ _id: new ObjectID(payload?.userId) });
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }
    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  //connect to db
  try {
    await createConnection();
  } catch (err) {
    console.log(err);
  }

  const appoloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [LoginResolver, RegisterResolver, ToDoResolver],
    }),

    context: ({ req, res }) => ({ req, res }),
  });

  appoloServer.applyMiddleware({ app });

  app.listen(5000, () => {
    console.log("express server started");
  });
})();
