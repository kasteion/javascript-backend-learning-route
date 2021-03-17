const express = require("express");
const app = express();
const server = require("http").Server(app);

const cors = require("cors");
const router = require("./network/routes");
const socket = require("./socket");
const db = require("./db");
const config = require("./config");
//const router = require("./components/messages/network");

db(config.dbUrl);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(router);

socket.connect(server);

router(app);

app.use("/app", express.static("public"));

server.listen(config.port, () => {
  console.log("Server listening on http://localhost:3000");
});
