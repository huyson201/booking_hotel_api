const { HotelStaff } = require('../models')

const canDeleteStaff = async (user, staffId) => {
    return (checkPermissionWithStaffId(user, staffId))
}

const canUpdateStaff = (user, staffId) => {
    return (checkPermissionWithStaffId(user, staffId))
}

const canCreateStaff = (user, staffId) => {
    return (checkPermissionWithStaffId(user, staffId))
}

const checkPermissionWithStaffId = async (user, staffId) => {
    let staff = await HotelStaff.findByPk(staffId)
    if (!staff) return false

    let hotel = await staff.getHotel()

    return (
        hotel.user_uuid === user.user_uuid
    )
}
module.exports = { canDeleteStaff, canUpdateStaff, canCreateStaff }