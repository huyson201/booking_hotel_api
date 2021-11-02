const role = require('../config/role')

const canGetHotels = (user) => {
    return (
        user.user_role === role.ADMIN
    )
}

const canCreateHotel = (user) => {
    return (
        user.user_role === role.ADMIN ||
        user.user_role === role.OWNER
    )
}

module.exports = { canGetHotels, canGetDetails, canCreateHotel }