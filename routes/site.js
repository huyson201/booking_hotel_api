const express = require("express")
const siteRoute = express.Router()
const siteController = require("../controllers/site")
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const authMiddleware = require('../middleware/auth')
const userMiddleware = require('../middleware/user')

siteRoute.get("/", siteController.index)

siteRoute.get('/images/:key', siteController.getImage)
siteRoute.get('/filter', siteController.filter)

siteRoute.post("/login", siteController.login)
siteRoute.post('/register', userMiddleware.validateUserData, siteController.register)
siteRoute.post('/logout', authMiddleware.checkToken, siteController.logout)
siteRoute.post('/refresh-token', siteController.refreshToken)
siteRoute.post('/send-otp', siteController.sendOTP)
siteRoute.post('/verify-otp', siteController.verifyOTP)
siteRoute.patch('/reset-password', authMiddleware.checkRestPasswordToken, siteController.resetPassword)
module.exports = siteRoute