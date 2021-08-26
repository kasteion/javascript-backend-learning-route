const express = require("express");

const response = require("../../../network/response");
const controller = require("./index");
const error = require("../../../utils/errors");

const router = express.Router();

const login = async (req, res) => {
  try {
    const token = await controller.login(req.body.username, req.body.password);
    response.success(req, res, token, 200);
  } catch (err) {
    throw new error(err.message, 401);
    //response.error(req, res, err.message, 400);
  }
};

router.post("/login", login);

module.exports = router;
