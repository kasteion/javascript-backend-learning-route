// ESto es lo del Mock
// const list = [];

// function addMessage(fullMessage) {
//   list.push(fullMessage);
// }

// function getMessages() {
//   return list;
// }
const Model = require("./model");

const addMessage = async (fullMessage) => {
  const message = new Model(fullMessage);
  const response = await message.save();
  return response;
};

// const getMessages = async (filterUser) => {
//   let filter = {};
//   if (filterUser) {
//     filter = { user: filterUser };
//   }
//   const response = await Model.find(filter);
//   return response;
// };

const getMessages = (filterUser) => {
  return new Promise((resolve, reject) => {
    let filter = {};
    if (filterUser) {
      filter = { user: filterUser };
    }
    const messages = Model.find(filter)
      .populate("user")
      .exec((error, populated) => {
        if (error) {
          reject(error);
        }
        resolve(populated);
      });
  });
};

const updateMessage = async (id, message) => {
  const response = await Model.updateOne(
    {
      _id: id,
    },
    {
      $set: { message },
    }
  );
  return response;
};

const getMessageById = async (id) => {
  const response = await Model.findOne({ _id: id });
  return response;
};

const deleteMessage = async (id) => {
  // console.log(id);
  const response = await Model.deleteOne({ _id: id });
  return response;
};

module.exports = {
  add: addMessage,
  list: getMessages,
  update: updateMessage,
  get: getMessageById,
  delete: deleteMessage,
};
