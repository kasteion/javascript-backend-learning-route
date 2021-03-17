const store = require("./store");
const socket = require("../../socket").socket;

const addMessage = (chat, user, message, file) => {
  return new Promise(async (resolve, reject) => {
    if (!user || !message || !chat) {
      reject({
        message: "Los datos son incorrectos",
        detail: "[Error]: No hay usuario, mensaje o chat",
      });
    } else {
      try {
        let fileUlr = "";
        if (file) {
          fileUlr = `http://localhost:3000/app/files/${file.filename}`;
        }
        const fullMessage = {
          chat,
          user,
          message,
          date: new Date(),
          file: fileUlr,
        };
        const result = await store.add(fullMessage);
        socket.io.emit("message", fullMessage);
        resolve(result);
      } catch (err) {
        reject({
          message: "Error Inesperado",
          detail: err.message,
        });
      }
    }
  });
};

const listMessages = (filter) => {
  return new Promise(async (resolve, reject) => {
    // setTimeout(() => {
    //   resolve(store.list());
    // }, 200);
    try {
      const list = await store.list(filter);
      resolve(list);
    } catch (err) {
      reject({
        message: "Error Inesperado",
        detail: err.message,
      });
    }
  });
};

const updateMessage = (id, message) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !message) {
        reject({
          message: "Los datos son incorrectos",
          detail: "[Error]: No hay id o mensaje",
        });
      }
      await store.update(id, message);
      const result = await store.get(id);
      // console.log(result);
      resolve(result);
    } catch (err) {
      reject({
        message: "Error Inesperado",
        detail: err.message,
      });
    }
  });
};

const deleteMessage = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        reject({
          message: "Los datos son incorrectos",
          detail: "[Error]: No hay id",
        });
      }
      const result = await store.delete(id);
      resolve(result);
    } catch (err) {
      reject({
        message: "Error Inesperado",
        detail: err.message,
      });
    }
  });
};

module.exports = {
  listMessages,
  addMessage,
  updateMessage,
  deleteMessage,
};
