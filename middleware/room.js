const { Room, Hotel, HotelStaff } = require('../models')
const checkUpdateRoomPermission = async (req, res, next) => {
    let user = req.user
    if (!user) return res.status(401).send('unauthorized')

    try {
        let { room_id } = req.body
        if (!room_id) return res.status(400).send('room id not found')

        let room = await Room.findOne({ where: { room_id: +room_id } })

        let hotel_id = room.hotel_id

        let hotel = await Hotel.findOne({ where: { hotel_id, user_uuid: user.user_uuid } })

        if (hotel) {
            req.room = room
            return next()
        }

        let staff = await HotelStaff.findOne({ where: { hotel_id, user_uuid: user.user_uuid } })

        if (staff) {
            req.room = room
            return next()
        }

        return res.status(403).send("Don't have permission")
    } catch (error) {
        return res.status(400).send(error.message)
    }

}

module.exports = { checkUpdateRoomPermission }