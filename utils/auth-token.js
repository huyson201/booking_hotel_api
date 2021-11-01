const jwt = require('jsonwebtoken')

const generateToken = (user, secret, expireIn) => {
    let userJson = user.get({ plain: true })
    let payload = { user_uuid: userJson.user_uuid, user_role: userJson.user_role }

    let token = jwt.sign(payload, secret, { expiresIn: expireIn })

    return token

}

module.exports = { generateToken }