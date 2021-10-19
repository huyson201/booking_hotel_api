const express = require("express")
const userRoute = express.Router()
const userController = require("../controllers/user")

userRoute.get("/", userController.index)
userRoute.get('/:uuid', userController.getById)
userRoute.delete("/", userController.delete)
module.exports = userRoute