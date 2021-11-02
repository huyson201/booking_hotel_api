const express = require("express")
const hotelRoute = express.Router()
const hotelController = require("../controllers/hotel")
const authMiddleware = require('../middleware/auth')
const hotelMiddleware = require('../middleware/hotel')
const { authRole } = require('../auth')
const role = require('../config/role')
const userMiddleware = require("../middleware/user")
const upload = require('multer')({ dest: 'uploads/' })
const uploadField = [
    { name: "photos" },
    { name: "avatar", maxCount: 1 }
]

hotelRoute.get('/:id(\\d+)/staffs', authMiddleware.checkToken, authRole([role.ADMIN, role.OWNER]), hotelController.getStaffs)

hotelRoute.get("/", authMiddleware.checkToken, authRole([role.ADMIN]), hotelMiddleware.authGetHotels, hotelController.index)

hotelRoute.get("/:id(\\d+$)", hotelController.getById)

hotelRoute.get("/:id(\\d+)/rooms", hotelController.getRooms)

hotelRoute.get('/:id(\\d+)/invoices', hotelController.getInvoices)

hotelRoute.post("/", authMiddleware.checkToken, upload.fields(uploadField), userMiddleware.authCreateUser, hotelController.create)

module.exports = hotelRoute