const bcrypt = require("bcrypt");
const auth = require("../../../auth");

const error = require("../../../utils/errors");

const TABLE = "auth";

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  const insertOne = async (data) => {
    const authData = {
      id: data.id,
    };

    if (data.username) {
      authData.username = data.username;
    }

    if (data.password) {
      authData.password = await bcrypt.hash(data.password, 5);
    }

    return store.insertOne(TABLE, authData);
  };

  const login = async (username, password) => {
    const data = await store.query(TABLE, { username: username });
    const equal = await bcrypt.compare(password, data.password);
    if (equal === true) {
      return auth.sign(data);
    } else {
      throw error("Invalid information", 401);
    }
  };

  return {
    insertOne,
    login,
  };
};
