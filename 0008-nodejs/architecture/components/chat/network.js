const express = require("express");
const response = require("../../network/response");
const controller = require("./controller");

const router = express.Router();

router.get("/:user", async (req, res) => {
  try {
    const { user } = req.params;
    const result = await controller.listChats(user);
    response.success(req, res, 200, result);
  } catch (err) {
    response.error(req, res, 400, err.message, err.detail);
  }
});

router.post("/", async (req, res) => {
  try {
    const { users } = req.body;
    const result = await controller.addChat(users);
    response.success(req, res, 200, result);
  } catch (err) {
    response.error(req, res, 400, err.message, err.detail);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await controller.deleteChat(id);
    response.success(req, res, 200, result);
  } catch (err) {
    response.error(req, res, 400, err.message, err.detail);
  }
});

module.exports = router;
