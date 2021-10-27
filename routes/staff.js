const express = require("express")
const staffRoute = express.Router()
const staffController = require("../controllers/staff")
const authMiddleware = require('../middleware/auth')

staffRoute.get("/", staffController.index)
staffRoute.get('/:id(\\d+$)', staffController.getById)

staffRoute.post("/", authMiddleware.checkToken, authMiddleware.checkOwnerOfHotel, staffController.create)

staffRoute.delete("/", authMiddleware.checkToken, authMiddleware.checkOwnerOfHotel, staffController.delete)

module.exports = staffRoute