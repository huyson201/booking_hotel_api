const express = require("express")
const siteRoute = express.Router()
const siteController = require("../controllers/site")

siteRoute.get("/", siteController.index)
module.exports = siteRoute