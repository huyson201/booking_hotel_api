const express = require("express")
const hotelRoute = express.Router()
const hotelController = require("../controllers/hotel")
hotelRoute.get("/", hotelController.index)

module.exports = hotelRoute