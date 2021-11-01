const express = require("express")
const userRoute = express.Router()
const userController = require("../controllers/user")
const multer = require('multer')
const authMiddleware = require('../middleware/auth')
const userMiddleware = require('../middleware/user')
const upload = multer({ dest: 'uploads/' })


userRoute.get("/", userMiddleware.authGetAll, userController.index)
userRoute.get('/:uuid', userMiddleware.authGetDetail, userController.getById)

userRoute.post('/', userMiddleware.authCreateUser, userController.create)

userRoute.patch('/:uuid', upload.single('avatar'), userMiddleware.authUpdateUser, userController.update)
userRoute.delete("/:uuid", userMiddleware.authDeleteUser, userController.delete)

userRoute.get('/:uuid/invoices', userMiddleware.authGetInvoices, userController.getInvoices)


module.exports = userRoute