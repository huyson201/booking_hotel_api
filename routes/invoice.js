const express = require("express")
const invoiceRoute = express.Router()
const invoiceController = require("../controllers/invoice")

// invoiceRoute.get("/", invoiceController.index)
// invoiceRoute.get('/:id(\\d+$)', invoiceController.getById)
module.exports = invoiceRoute