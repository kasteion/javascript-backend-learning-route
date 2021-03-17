const Model = require("./model");

const addChat = (fullChat) => {
  const chat = new Model(fullChat);
  return chat.save();
};

const getChat = (filter) => {
  return new Promise((resolve, reject) => {
    const chat = Model.find(filter)
      .populate("users")
      .exec((error, populated) => {
        if (error) {
          reject(error);
        }
        resolve(populated);
      });
  });
};

const deleteChat = async (id) => {
  return Model.deleteOne({ _id: id });
};

module.exports = {
  add: addChat,
  list: getChat,
  delete: deleteChat,
};
