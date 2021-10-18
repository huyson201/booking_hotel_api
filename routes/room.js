const express = require("express")
const roomRoute = express.Router()
const roomController = require("../controllers/room")

roomRoute.get("/", roomController.index)
roomRoute.get('/:id(\\d+$)', roomController.getById)
module.exports = roomRoute