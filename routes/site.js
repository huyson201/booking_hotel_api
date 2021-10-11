const express = require("express")
const siteRoute = express.Router()
const siteController = require("../controllers/site")
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

siteRoute.get("/", siteController.index)
siteRoute.post('/register', siteController.register)
siteRoute.post('/upload', upload.single('image'), siteController.uploadFile)
siteRoute.get('/images/:key', siteController.getImage)

module.exports = siteRoute