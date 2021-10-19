const express = require("express")
const siteRoute = express.Router()
const siteController = require("../controllers/site")
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const authMiddleware = require('../middleware/auth')

siteRoute.get("/", siteController.index)
siteRoute.post('/upload', upload.single('image'), siteController.uploadFile)
siteRoute.get('/images/:key', siteController.getImage)
siteRoute.get('/filter', siteController.filter)

siteRoute.post("/login", siteController.login)
siteRoute.post('/register', siteController.register)
siteRoute.post('/logout', authMiddleware.checkToken, siteController.logout)
siteRoute.post('/refresh-token', siteController.refreshToken)

module.exports = siteRoute