const express = require('express')
const route = express.Router()
const {
    index,
    create,
    getById,
    deleteById,
    update
} = require('../controllers/service')

route.get('/', index)
route.get('/:id', getById)
route.post('/', create)
route.delete('/:id', deleteById)
route.patch('/:id', update)
module.exports = route