const express = require("express")
const staffRoute = express.Router()
const staffController = require("../controllers/staff")
const authMiddleware = require('../middleware/auth')
const staffMiddleware = require('../middleware/staff')

staffRoute.get("/", staffController.index)

staffRoute.get('/:id(\\d+$)', staffController.getById)

staffRoute.post("/", authMiddleware.checkToken, staffMiddleware.authCreateStaff, staffController.create)

staffRoute.delete("/:id(\\d+$)", authMiddleware.checkToken, staffMiddleware.authDeleteStaff, staffController.delete)

staffRoute.patch('/:id(\\d+$)', authMiddleware.checkToken, staffMiddleware.authUpdateStaff, staffController.update)

staffRoute.get('/:id/hotels', authMiddleware.checkToken, staffController.getHotel)
module.exports = staffRoute