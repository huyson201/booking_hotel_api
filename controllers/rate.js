const { Rate } = require('../models')

exports.index = async (req, res) => {
    const { user_uuid, hotel_id } = req.query
    const query = { where: { user_uuid, hotel_id } }
    try {
        let rates = await Rate.findAndCountAll(query)
        return res.status(200).json({
            message: 'success',
            data: rates,
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}


exports.create = async (req, res) => {
    let data = req.body
    data.user_uuid = req.user.user_uuid
    try {
        let rate = await Rate.create(data)
        return res.status(201).json({
            message: 'success',
            data: rate
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}

exports.update = async (req, res) => {
    let data = req.body
    let user_uuid = req.user.user_uuid
    let rate_id = req.params.id
    try {
        let rate = await Rate.findOne({ where: { id: rate_id, user_uuid } })
        await rate.update(data)
        return res.status(200).json({
            message: 'success',
            data: rate
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}

exports.remove = async (req, res) => {
    let user_uuid = req.user.user_uuid
    let rate_id = req.params.id

    try {
        await Rate.destroy({ where: { id: rate_id, user_uuid } })

        return res.status(204).json({
            message: 'success',
        })
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}