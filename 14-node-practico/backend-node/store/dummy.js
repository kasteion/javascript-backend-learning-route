const { nanoid } = require("nanoid");

const firstUserId = nanoid();

const db = {
  users: [],
  auth: [],
};

const getAll = async (table) => {
  return db[table];
};

const getOne = async (table, id) => {
  const collection = await getAll(table);
  return collection.find((item) => item.id === id);
};

const query = async (table, q) => {
  const collection = await getAll(table);
  const keys = Object.keys(q);
  const key = keys[0];
  return collection.find((item) => item[key] === q[key]) || null;
};

const insertOne = async (table, payload) => {
  const id = payload.id || nanoid();
  db[table].push({ id, ...payload });
  const inserted = await getOne(table, id);
  console.log(inserted);
  return inserted;
};

const deleteOne = async (table, id) => {
  db[table] = db[table].filter((item) => item.id !== id);
  return true;
};

const updateOne = async (table, payload) => {
  const id = payload.id || "";
  db[table] = db[table].map((item) => {
    if (item.id === payload.id) {
      const keys = Object.keys(payload);
      keys.map((key) => {
        item[key] = payload[key];
      });
    }
    return item;
  });
};

module.exports = {
  getAll,
  getOne,
  query,
  insertOne,
  deleteOne,
  updateOne,
};
