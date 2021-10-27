const validator = require('validator')
class UserMiddleware {

    checkUpdateRole(req, res, next) {
        if (req.user.user_role !== 0 && req.user.user_uuid !== req.body.user_uuid) return res.status(401).json({ code: 401, name: "", message: "Don't have permission!" })
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