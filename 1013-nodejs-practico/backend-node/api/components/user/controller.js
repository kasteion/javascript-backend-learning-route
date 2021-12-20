const TABLE = "users";

module.exports = function (injectedStore) {
  let store = injectedStore;
  if (!store) {
    store = require("../../../store/dummy");
  }

  const getAll = () => {
    return store.getAll(TABLE);
  };

  const getOne = (id) => {
    return store.getOne(TABLE, id);
  };

  const insertOne = async (user) => {
    return store.insertOne(TABLE, user);
  };

  const deleteOne = (id) => {
    return store.deleteOne(TABLE, id);
  };

  const updateOne = (user) => {
    return store.updateOne(TABLE, user);
  };

  return {
    getAll,
    getOne,
    insertOne,
    deleteOne,
    updateOne,
  };
};
