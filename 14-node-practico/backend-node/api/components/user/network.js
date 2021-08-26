const express = require("express");

const response = require("../../../network/response");
const controller = require("./index");
const authController = require("../auth");
const secure = require("./secure");

const router = express.Router();

const getOne = async (req, res) => {
  try {
    const user = await controller.getOne(req.params.id);
    response.success(req, res, user, 200);
  } catch (err) {
    response.error(req, res, err.message, 500);
  }
};

const getAll = async (req, res) => {
  try {
    const users = await controller.getAll();
    response.success(req, res, users, 200);
  } catch (err) {
    response.error(req, res, err.message, 500);
  }
};

const insertOne = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const user = await controller.insertOne({ name });
    await authController.insertOne({
      id: user.id,
      username: username,
      password: password,
    });
    response.success(req, res, user, 201);
  } catch (err) {
    response.error(req, res, err.message, 500);
  }
};

const deleteOne = async (req, res) => {
  try {
    const user = await controller.deleteOne(req.params.id);
    response.success(req, res, user, 200);
  } catch (err) {
    response.error(req, res, err.message, 500);
  }
};

const updateOne = async (req, res) => {
  try {
    const { id, name } = req.body;
    const user = await controller.updateOne({ id, name });
    response.success(req, res, user, 200);
  } catch (err) {
    response.err(req, res, err.message, 500);
  }
};

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", insertOne);
router.put("/", secure("update"), updateOne);
router.delete("/:id", deleteOne);

module.exports = router;
