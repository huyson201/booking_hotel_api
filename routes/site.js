const express = require("express")
const siteRoute = express.Router()
const siteController = require("../controllers/site")

siteRoute.get("/", siteController.index)
siteRoute.post('/register', siteController.register)
module.exports = siteRoute