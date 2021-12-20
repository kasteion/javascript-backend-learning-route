const socketIO = require("socket.io");
let socket = {};

function connect(server) {
  socket.io = socketIO(server);
}

module.exports = {
  connect,
  socket,
};
