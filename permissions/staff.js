const { HotelStaff } = require('../models')
const role = require('../config/role')
const canDeleteStaff = async (user) => {
    return (
        user.user_role === role.OWNER
    )
}

const canUpdateStaff = async (user, staffId) => {
    let staff = await HotelStaff.findByPk(staffId)

    return (
        user.user_role === role.OWNER ||
        (staff && staff.user_uuid === user.user_uuid)
    )
}

const canCreateStaff = (user) => {
    return (
        user.user_role === role.OWNER ||
        user.user_role === role.ADMIN
    )
}


module.exports = { canDeleteStaff, canUpdateStaff, canCreateStaff }