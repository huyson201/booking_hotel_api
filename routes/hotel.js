const express = require("express")
const hotelRoute = express.Router()
const hotelController = require("../controllers/hotel")
hotelRoute.get("/", hotelController.index)
hotelRoute.get("/:id(\\d+$)", hotelController.getById)
hotelRoute.get("/:id(\\d+)/rooms", hotelController.getRooms)
module.exports = hotelRoute