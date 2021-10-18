const { Hotel } = require("../models")

class HotelController {
    async index(req, res) {
        try {
            let hotels = await Hotel.findAndCountAll()
            return res.json({ msg: "success", data: hotels })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async getById(req, res) {
        let id = req.params.id
        if (!id) return res.status(404).json({ msg: "id not found" })
        try {
            let hotel = await Hotel.findByPk(id)
            return res.json({ msg: "success", data: hotel })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async getRooms(req, res) {
        let id = req.params.id
        if (!id) return res.status(404).json({ msg: "id not found" })
        let query = {}
        query.include = [
            {
                association: "rooms"
            }
        ]
        try {
            let hotel = await Hotel.findByPk(id, query)
            return res.json({ msg: "success", data: hotel })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }
}

const hotelController = new HotelController
module.exports = hotelController