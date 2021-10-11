const { Hotel } = require("../models")

class HotelController {
    async index(req, res) {
        try {
            let hotels = await Hotel.findAll()
            return res.json({ msg: "success", data: hotels })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }
}

const hotelController = new HotelController
module.exports = hotelController