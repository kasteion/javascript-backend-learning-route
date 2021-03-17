const { query } = require("express");
const express = require("express");
const response = require("./network/response");

const router = express.Router();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

// app.use("/", (req, res) => {
//   res.send("Hola");
// });

router.get("/messages", (req, res) => {
  //console.log(req.headers);
  let query = req.query;
  if (query.hasOwnProperty("error")) {
    if (query.error === "true") {
      response.error(
        req,
        res,
        "Error inesperado",
        400,
        "Es solo una simulación de los errores"
      );
      return;
    }
  }
  response.success(req, res, "Listado de mensajes", 200);
});

router.post("/messages", (req, res) => {
  console.log(req.headers);
  console.log(req.body);
  console.log(req.query);
  res.header({
    "custom-header": "Nuestro valor personalizado",
  });
  res.send("Mensaje creado");
});

router.put("/messages", (req, res) => {
  res.send("Mensaje editado");
});

router.delete("/messages", (req, res) => {
  res.send("Mensaje borrado");
});

app.use("/app", express.static("public"));

app.listen(3000);
console.log("Server listening on http://localhost:3000");
