const express = require("express")
const hotelRoute = express.Router()
const hotelController = require("../controllers/hotel")
hotelRoute.get("/", hotelController.index)
hotelRoute.get("/:id(([0-9]+))", hotelController.getById)
hotelRoute.get("/:id(([0-9]+))/rooms", hotelController.getRooms)
module.exports = hotelRoute