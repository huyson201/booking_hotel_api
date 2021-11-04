const express = require("express")
const userRoute = express.Router()
const userController = require("../controllers/user")
const authMiddleware = require('../middleware/auth')
const userMiddleware = require('../middleware/user')
const multer = require('multer')

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('invalid image file!', false);
    }
};

const upload = multer({ storage, fileFilter });


userRoute.get("/", userMiddleware.authGetAll, userController.index)
userRoute.get('/:uuid', userMiddleware.authGetDetail, userController.getById)

userRoute.post('/', userMiddleware.authCreateUser, userController.create)

userRoute.patch('/:uuid', upload.single('avatar'), userMiddleware.authUpdateUser, userController.update)
userRoute.delete("/:uuid", userMiddleware.authDeleteUser, userController.delete)

userRoute.get('/:uuid/invoices', userMiddleware.authGetInvoices, userController.getInvoices)

userRoute.get('/:uuid/hotels', userMiddleware.authGetHotels, userController.getHotels)

module.exports = userRoute