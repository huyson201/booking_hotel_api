const role = require('../config/role')

const canGetUsers = (user) => {
    return (
        user.user_role === role.ADMIN
    )
}

const canAddHotels = (user) => {
    return (
        user.user_role === role.OWNER
    )
}

const canGetUserDetail = (user, userId) => {
    return (
        user.user_role === role.ADMIN ||
        user.user_role === role.OWNER ||
        user.user_role === role.HOTEL_STAFF ||
        user.user_uuid === userId
    )
}

const canDeleteUser = (user) => {
    return (
        user.user_role === role.ADMIN
    )
}

const canUpdateUser = (user, userId) => {
    return (
        user.user_role === role.ADMIN ||
        user.user_uuid === userId
    )
}

const canCreateUser = (user) => {
    return (
        user.user_role === role.ADMIN
    )
}

const canGetInvoices = (user, userId) => {
    return (
        user.user_role === role.ADMIN ||
        user.user_uuid === userId
    )
}

const canGetHotelsOfUser = (user, userId) => {
    return (
        user.user_role === role.ADMIN ||
        user.user_uuid === userId
    )
}
module.exports = {
    canGetUserDetail,
    canDeleteUser,
    canUpdateUser,
    canGetUsers,
    canCreateUser,
    canGetInvoices,
    canGetHotelsOfUser,
    canAddHotels
}