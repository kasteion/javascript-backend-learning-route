const Model = require("./model");

const addUser = (userToCreate) => {
  const user = new Model(userToCreate);
  // Puedo devolver directamente user.save pues user.save devuelve una promesa.
  return user.save();
};

const listUsers = () => {
  return Model.find();
};

const updateUser = (id, name) => {
  return Model.updateOne(
    {
      _id: id,
    },
    {
      $set: { name },
    }
  );
};

const getUserById = (id) => {
  return Model.findOne({ _id: id });
};

const deleteUser = (id) => {
  return Model.deleteOne({ _id: id });
};

module.exports = {
  add: addUser,
  list: listUsers,
  update: updateUser,
  get: getUserById,
  delete: deleteUser,
};
