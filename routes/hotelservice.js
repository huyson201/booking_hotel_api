const express = require("express");
const route = express.Router();
const {
  index,
  create,
  update,
  remove,
  getById,
} = require("../controllers/hotelservice");
const authMiddleware = require("../middleware/auth");

route.post("/", create);
route.get("/", index);
route.get("/:id", getById);
route.patch("/:id", authMiddleware.checkToken, update);
route.delete("/:id", remove);

module.exports = route;
