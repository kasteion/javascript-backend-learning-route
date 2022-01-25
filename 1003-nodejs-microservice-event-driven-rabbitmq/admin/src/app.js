"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var app = express();
app.use(cors({
    origin: [
        // React
        "http://localhost:3000",
        // Vue
        "http://localhost:8080",
        // Angular
        "http://localhost:4200",
    ],
}));
app.listen(8000, function () {
    console.log("Listening on port 8000");
});
