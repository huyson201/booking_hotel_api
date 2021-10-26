const express = require("express")
const hotelRoute = express.Router()
const hotelController = require("../controllers/hotel")
const multer = require('multer')
const authMiddleware = require('../middleware/auth')

const upload = multer({ dest: 'uploads/' })
const uploadField = [
    { name: "photos" },
    { name: "avatar", maxCount: 1 }
]

hotelRoute.get("/", hotelController.index)
hotelRoute.get("/:id(\\d+$)", hotelController.getById)
hotelRoute.get("/:id(\\d+)/rooms", hotelController.getRooms)
hotelRoute.get('/:id(\\d+)/staffs', hotelController.getStaffs)
hotelRoute.get('/:id(\\d+)/invoices', hotelController.getInvoices)

hotelRoute.post("/", upload.fields(uploadField), authMiddleware.checkToken, authMiddleware.checkHotelOwnerPermission, hotelController.create)
module.exports = hotelRoute