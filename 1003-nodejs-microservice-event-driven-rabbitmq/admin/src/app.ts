import * as express from "express";
import * as cors from "cors";
import { createConnection } from "typeorm";

createConnection().then((db) => {
  const app = express();

  app.use(
    cors({
      origin: [
        // React
        "http://localhost:3000",
        // Vue
        "http://localhost:8080",
        // Angular
        "http://localhost:4200",
      ],
    })
  );

  app.listen(8000, () => {
    console.log(`Listening on port 8000`);
  });
});
