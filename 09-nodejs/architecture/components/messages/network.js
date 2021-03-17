const express = require("express");
const multer = require("multer");
const response = require("../../network/response");
const controller = require("./controller");

const router = express.Router();

const upload = multer({
  dest: "public/files/",
});

router.get("/", async (req, res) => {
  //console.log(req.headers);
  // let query = req.query;
  // if (query.hasOwnProperty("error")) {
  //   if (query.error === "true") {
  //     response.error(
  //       req,
  //       res,
  //       400,
  //       "Error inesperado",
  //       "Es solo una simulación de los errores"
  //     );
  //     return;
  //   }
  // }
  try {
    const filter = req.query.user || null;
    const messages = await controller.listMessages(filter);
    response.success(req, res, 200, messages);
  } catch (err) {
    response.error(req, res, 500, err.message, err.detail);
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  // console.log(req.headers);
  // console.log(req.body);
  // res.header({
  //   "custom-header": "Nuestro valor personalizado",
  // });
  const file = req.file;
  const { chat, user, message } = req.body;
  try {
    //console.log(file);
    const fullMessage = await controller.addMessage(chat, user, message, file);
    response.success(req, res, 201, fullMessage);
  } catch (err) {
    response.error(req, res, 400, err.message, err.detail);
  }
});

router.patch("/:id", async (req, res) => {
  //console.log(req.params.id);
  try {
    const { id } = req.params;
    const { message } = req.body;
    const result = await controller.updateMessage(id, message);
    response.success(req, res, 200, result);
  } catch (err) {
    response.error(req, res, 500, err.message, err.detail);
  }
});

// router.put("/", (req, res) => {
//   response.success(req, res, 200, "Mensaje editado");
// });

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await controller.deleteMessage(id);
    response.success(
      req,
      res,
      200,
      `Mensaje con _id: ${id} borrado éxitosamente.`
    );
  } catch (err) {
    response.error(req, res, 500, err.message, err.detail);
  }
});

module.exports = router;
