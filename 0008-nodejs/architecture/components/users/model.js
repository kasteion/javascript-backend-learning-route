const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const model = mongoose.model("Users", userSchema);

module.exports = model;
