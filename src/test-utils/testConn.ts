import { createConnection } from "typeorm";

export const testConn = (drop: boolean = false) => {
  return createConnection({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "todolist-db-test",
    synchronize: true,
    entities: [__dirname +"/../entity/**/*"],
    migrations: ["src/migration/**/*"],
    subscribers: ["src/subscriber/**/*"],
    dropSchema: drop,
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  });
};
