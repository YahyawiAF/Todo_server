import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";

import { createSchema } from "./utils/createSchema";
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
  const schema = await createSchema();

  const appoloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  appoloServer.applyMiddleware({ app });

  app.listen(5000, () => {
    console.log("express server started");
  });
})();
