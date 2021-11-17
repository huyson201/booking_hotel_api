const express = require('express')
const route = express.Router()
const authMiddleware = require('../middleware/auth')
const { index, create, update, remove } = require('../controllers/rate')

route.get('/', index)
route.post('/', authMiddleware.checkToken, create)
route.patch('/:id', authMiddleware.checkToken, update)
route.delete('/:id', authMiddleware.checkToken, remove)
module.exports = route