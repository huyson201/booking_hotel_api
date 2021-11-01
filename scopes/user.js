const role = require('../config/role')
const { User } = require('../models')
const updateScope = (authRole, user, data) => {

    return new Promise(async (resolve, reject) => {

        try {
            if (authRole === role.ADMIN) {
                user.update({ ...data })
                resolve(user)
            }

            if (authRole === role.USER) {
                await user.update({ ...data, user_email: undefined, user_role: undefined })
                resolve(user)
            }
        } catch (error) {
            reject(error)
        }
    })

}

module.exports = { updateScope }