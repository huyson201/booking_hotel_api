const { Service } = require('../models')

exports.index = async (req, res) => {
    try {
        let services = await Service.findAll()
        return res.status(200).json({
            message: 'success',
            data: services
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}

exports.create = async (req, res) => {
    const data = req.body

    try {
        let service = await Service.create(data)
        return res.status(201).json({
            message: 'success',
            data: service
        })

    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}

exports.getById = async (req, res) => {
    const id = req.params.id
    if (!id) return res.status(400).send('services id not found')

    try {
        let service = await Service.findByPk(id)
        return res.status(200).json({
            message: 'success',
            data: service
        })

    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}

exports.deleteById = async (req, res) => {
    const id = req.params.id
    if (!id) return res.status(400).send('services id not found')

    try {
        let service = await Service.destroy({ where: { service_id: id } })
        return res.status(204).json({
            message: 'success',
            data: service
        })

    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}

exports.update = async (req, res) => {
    const data = req.body
    const id = req.params.id
    if (!id) return res.status(400).send('services id not found')
    try {
        let service = await Service.update(data, { where: { service_id: id }, plain: true })
        console.log(service)
        return res.status(204).json({
            message: 'success'
        })

    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}