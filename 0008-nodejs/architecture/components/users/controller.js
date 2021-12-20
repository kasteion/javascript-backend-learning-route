const { response } = require("express");
const store = require("./store");

const listUsers = () => {
  return store.list();
};

const addUser = (name) => {
  if (!name) {
    return Promise.reject({
      message: "Los datos son incorrectos",
      detail: "[Error]: No hay nombre de usuario",
    });
  }
  const userToCreate = {
    name,
  };
  return store.add(userToCreate);
};

const updateUser = async (id, name) => {
  if (!name) {
    return Promise.reject({
      message: "Los datos son incorrectos",
      detail: "[Error]: No hay nombre de usuario",
    });
  }
  await store.update(id, name);
  return store.get(id);
};

const deleteUser = async (id) => {
  if (!id) {
    return Promise.reject({
      message: "Los datos son incorrectos",
      detail: "[Error]: No hay nombre de usuario",
    });
  }
  await store.delete(id);
  return Promise.resolve({
    error: "",
    body: `Usuario con _id: ${id} borrado con éxito`,
  });
};

module.exports = {
  addUser,
  listUsers,
  updateUser,
  deleteUser,
};
