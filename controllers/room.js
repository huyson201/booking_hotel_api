const { Room } = require('../models')
class RoomController {
    async index(req, res) {
        try {
            let rooms = await Room.findAll()
            return res.json({ msg: "success", data: rooms })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async getById(req, res) {
        let id = req.params.id
        if (!id) return res.status(404).json({ msg: "id not found!" })
        try {
            let room = await Room.findByPk(id)
            return res.json({ msg: "success", data: room })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }
}

const roomController = new RoomController
module.exports = roomController