const express = require("express");
const response = require("../../network/response");
const controller = require("./controller");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await controller.listUsers();
    response.success(req, res, 200, users);
  } catch (err) {
    response.error(req, res, 500, err.message, err.detail);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const userCreated = await controller.addUser(name);
    response.success(req, res, 201, userCreated);
  } catch (err) {
    response.error(req, res, 400, err.message, err.detail);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const result = await controller.updateUser(id, name);
    response.success(req, res, 200, result);
  } catch (err) {
    response.error(req, res, 400, err.message, err.detail);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await controller.deleteUser(id);
    response.success(req, res, 200, result);
  } catch (err) {
    response.err(req, res, 400, err.message, err.detail);
  }
});

module.exports = router;
