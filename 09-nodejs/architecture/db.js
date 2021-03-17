const db = require("mongoose");

db.Promise = global.Promise;

const connect = async (mongoUrl) => {
  await db.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("[db] Conectada con éxito");
};

module.exports = connect;
