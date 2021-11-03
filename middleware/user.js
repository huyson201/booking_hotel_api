const validator = require('validator')
const {
    canGetUserDetail,
    canDeleteUser,
    canUpdateUser,
    canGetUsers,
    canCreateUser,
    canGetInvoices,
    canGetHotelsOfUser
} = require('../permissions/user')
class UserMiddleware {

    authGetAll(req, res, next) {
        if (!canGetUsers(req.user)) {
            return res.status(403).send("Don't Have Permission")
        }

        return next()
    }

    authGetDetail(req, res, next) {
        if (!canGetUserDetail(req.user, req.params.uuid)) {
            return res.status(403).send("Don't Have Permission")
        }

        return next()
    }

    authDeleteUser(req, res, next) {
        if (!canDeleteUser(req.user)) {
            return res.status(403).send("Don't Have Permission")
        }

        return next()
    }

    authUpdateUser(req, res, next) {
        if (!canUpdateUser(req.user, req.params.uuid)) {
            return res.status(403).send("Don't Have Permission")
        }

        return next()
    }

    authCreateUser(req, res, next) {
        if (!canCreateUser(req.user)) {
            return res.status(403).send("Don't Have Permission")
        }

        return next()
    }

    authGetInvoices(req, res, next) {
        if (!canGetInvoices(req.user, req.params.uuid)) {
            return res.status(403).send("Don't Have Permission")
        }

        return next()
    }

    authGetHotels(req, res, next) {
        if (!canGetHotelsOfUser(req.user, req.params.uuid)) {
            return res.status(403).send("Don't Have Permission")
        }

        return next()
    }
    validateUserData(req, res, next) {
        let { user_email, user_phone, user_password, confirm_password } = req.body

        if (!validator.isEmail(user_email)) return res.status(400).send('email invalid')
        if (!validator.isMobilePhone(user_phone, 'vi-VN')) return res.status(400).send('phone number invalid')

        if (user_password.length < 6) return res.status(400).send('password lengths must longer than 6-characters.')

        if (user_password !== confirm_password) return res.status(400).send('confirm password not math.')
        return next()
    }
}

const userMiddleware = new UserMiddleware

module.exports = userMiddleware