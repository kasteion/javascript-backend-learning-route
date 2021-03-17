const messages = require("../components/messages/network");
const users = require("../components/users/network");
const chat = require("../components/chat/network");

const routes = (server) => {
  server.use("/message", messages);
  server.use("/user", users);
  server.use("/chat", chat);
};

module.exports = routes;
