const express = require("express");
const swaggerUI = require("swagger-ui-express");

const config = require("../config");
const errors = require("../network/errors");
const user = require("./components/user/network");
const auth = require("./components/auth/network");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", user);
app.use("/api/auth", auth);

const swaggerDoc = require("./swagger.json");
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use(errors);
app.listen(config.api.port, () => {
  console.log("Listening on port", config.api.port);
});
