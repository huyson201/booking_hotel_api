const express = require("express")
const roomRoute = express.Router()
const roomController = require("../controllers/room")
const authMiddleware = require('../middleware/auth')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

roomRoute.get("/", roomController.index)
roomRoute.get('/:id(\\d+$)', roomController.getById)
roomRoute.post("/", authMiddleware.checkToken, upload.array('slideImgs'), authMiddleware.checkOwnerOfHotel, roomController.create)
module.exports = roomRoute