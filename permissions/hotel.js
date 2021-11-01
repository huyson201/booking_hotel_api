const role = require('../config/role')
const { Hotel } = require('../models')
const canGetHotels = (user) => {
    return (
        user.user_role === role.ADMIN
    )
}

const canGetDetails = async (user, hotelId) => {
    let hotel = await Hotel.count({ where: { user_uuid: user.user_uuid, hotel_id: hotelId } })
    let checkHotel = hotel ? true : false
    return (
        user.user_role === role.ADMIN ||
        checkHotel
    )
}
module.exports = { canGetHotels, canGetDetails }