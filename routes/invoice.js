const express = require("express")
const invoiceRoute = express.Router()
const invoiceController = require("../controllers/invoice")
const authMiddleware = require('../middleware/auth')


invoiceRoute.get("/", invoiceController.index)
invoiceRoute.get('/:id(\\d+$)', invoiceController.getById)
invoiceRoute.post('/', invoiceController.create)
invoiceRoute.patch('/:id', invoiceController.update)
module.exports = invoiceRoute