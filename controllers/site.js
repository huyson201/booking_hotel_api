const bcrypt = require('bcrypt');
const { User } = require('../models')
class SiteController {
    index(req, res) {
        return res.json({ msg: "welcome" })
    }

    async register(req, res) {
        let { user_name, user_email, user_password, confirm_password, user_phone, user_role } = req.body
        if (confirm_password !== user_password) return res.json({ msg: "confirm password invalid" })
        if (!user_role) user_role = 0

        let hash = bcrypt.hashSync(user_password, 10)
        try {
            let user = await User.create({ user_name, user_email, user_password: hash, user_phone, user_role })
            return res.json({
                msg: "success",
                data: user
            })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }

    }
}
const siteController = new SiteController

module.exports = siteController