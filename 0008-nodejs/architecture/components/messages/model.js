const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  chat: {
    type: String,
    ref: "Chat",
  },
  user: {
    type: String,
    ref: "Users",
  },
  message: {
    type: String,
    required: true,
  },
  date: Date,
  file: String,
});

const model = mongoose.model("Messages", messageSchema);

module.exports = model;
