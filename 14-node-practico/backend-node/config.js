module.exports = {
  api: {
    port: process.env.NODE_PORT || 3000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "N0tS0S3cr3t!",
  },
};
