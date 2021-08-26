const jwt = require("jsonwebtoken");

const config = require("../config");
const error = require("../utils/errors");

const secret = config.jwt.secret;

const sign = (data) => {
  return jwt.sign(data, secret);
};

const verify = (data) => {
  return jwt.verify(data, secret);
};

const getToken = (auth) => {
  if (!auth) throw error("There is no token", 401);

  if (auth.indexOf("Bearer ") === -1) throw error("Invalid format", 401);

  let token = auth.replace("Bearer ", "");
  return token;
};

const decodeHeader = (req) => {
  const authorization = req.headers.authorization || "";
  const token = getToken(authorization);
  const decoded = verify(token);
  req.user = decoded;
  return decoded;
};

const check = {
  own: function (req, owner) {
    const decoded = decodeHeader(req);
    console.log(decoded);
    console.log(owner);
    if (decoded.id !== owner) throw error("You can't do this", 401);
  },
};

module.exports = {
  sign,
  check,
};
