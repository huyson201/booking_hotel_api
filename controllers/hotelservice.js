const { HotelService } = require('../models')

exports.index = async (req, res) => {
    try {
        let htServices = await HotelService.findAll()
        return res.status(200).json({
            message: 'success',
            data: htServices
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}

exports.create = async (req, res) => {
    try {
        let htService = await HotelService.create(req.body)
        return res.status(200).json({
            message: 'success',
            data: htService
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}

exports.update = async (req, res) => {
    const id = req.params.id
    if (!id) return res.status(400).send('hotelService id not found! ')

    try {
        let htService = await HotelService.update(req.body, { where: { id: id } })
        return res.status(204).json({
            message: 'success',
            data: htService
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}

exports.remove = async (req, res) => {
    const id = req.params.id
    if (!id) return res.status(400).send('hotelService id not found! ')

    try {
        await HotelService.destroy({ where: { id: id } })
        return res.status(204).send()
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}

exports.getById = async (req, res) => {
    const id = req.params.id
    if (!id) return res.status(400).send('hotelService id not found! ')

    try {
        let data = await HotelService.findByPk(id)
        return res.status(200).json({
            message: 'success',
            data: data
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}