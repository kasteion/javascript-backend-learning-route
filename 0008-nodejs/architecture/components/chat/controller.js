const store = require("./store");

const addChat = (users) => {
  if (!users || !Array.isArray(users)) {
    return Promise.reject({
      message: "Los datos son incorrectos",
      detail: "[Error]: no hay usuarios o no es un arreglo",
    });
  }
  const fullChat = {
    users,
  };
  return store.add(fullChat);
};

const listChats = (user) => {
  if (!user) {
    return Promise.reject({
      message: "Los datos son incorrectos",
      detail: "[Error]: No hay usuario",
    });
  }
  const filter = {
    users: user,
  };
  return store.list(filter);
};

const deleteChat = async (id) => {
  if (!id) {
    return Promise.reject({
      message: "Los datos son incorrectos",
      detail: "[Error]: No hay id de chat",
    });
  }
  await store.delete(id);
  return Promise.resolve(`Chat con _id: ${id} borrado con éxito.`);
};

module.exports = {
  addChat,
  listChats,
  deleteChat,
};
