const role = require('../config/role')

const updateScope = (authRole, user, data) => {

    return new Promise(async (resolve, reject) => {

        try {
            if (authRole === role.ADMIN) {
                user.update({ ...data })
                resolve(user)
            }

            await user.update({ ...data, user_email: undefined, user_role: undefined })
            resolve(user)

        } catch (error) {
            reject(error)
        }
    })

}

module.exports = { updateScope }