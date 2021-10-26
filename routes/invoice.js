const express = require("express")
const invoiceRoute = express.Router()
const invoiceController = require("../controllers/invoice")
const authMiddleware = require('../middleware/auth')
const { checkUpdatePermission } = require('../middleware/invoice')

invoiceRoute.get("/", invoiceController.index)
invoiceRoute.get('/:id(\\d+$)', invoiceController.getById)
invoiceRoute.post('/', authMiddleware.checkToken, invoiceController.create)
invoiceRoute.patch('/', authMiddleware.checkToken, checkUpdatePermission, invoiceController.update)
module.exports = invoiceRoute