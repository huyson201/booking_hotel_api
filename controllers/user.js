const { User } = require('../models')
class UserController {
    async index(req, res) {
        try {
            let users = await User.findAll()
            return res.json({ message: "success", data: users })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async getById(req, res) {
        let user_uuid = req.params.uuid
        if (!user_uuid) return res.status(404).json({ msg: "id not found!" })
        try {
            let user = await User.findByPk(user_uuid)
            return res.json({ msg: "success", data: user })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async delete(req, res) {
        let { delete_id } = req.body
        if (!delete_id) return res.status(404).json({ code: 404, name: "Not found", message: "Delete_id not found!" })
        try {
            let user = await User.findByPk(delete_id)
            if (!user) return res.status(404).json({ code: 404, name: "Not found", message: "User not found!" })

            user = await user.destroy()

            return res.json(
                {
                    code: 0,
                    name: "Delete",
                    message: "Delete user successfully"
                }
            )
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

}

const userController = new UserController
module.exports = userController