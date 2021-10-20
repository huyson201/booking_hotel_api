const express = require("express")
const userRoute = express.Router()
const userController = require("../controllers/user")
const multer = require('multer')
const authMiddleware = require('../middleware/auth')
const userMiddleware = require('../middleware/user')
const upload = multer({ dest: 'uploads/' })

userRoute.get("/", userController.index)
userRoute.get('/:uuid', userController.getById)
userRoute.get('/:uuid/invoices', userController.getInvoices)
userRoute.post('/', authMiddleware.checkToken, userMiddleware.checkCreateRole, userController.create)
userRoute.patch('/', authMiddleware.checkToken, upload.single('avatar'), userMiddleware.checkUpdateRole, userController.update)
userRoute.delete("/", userController.delete)

module.exports = userRoute