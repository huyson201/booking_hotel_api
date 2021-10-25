const { User, Invoice } = require('../models')
const { uploadFile } = require('../s3')
require('dotenv').config()
class UserController {

    async index(req, res) {
        try {
            let users = await User.findAll()
            return res.json({ message: "success", data: users })
        }
        catch (err) {
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
        if (!delete_id) return res.status(400).send('delete id not found')
        try {
            let user = await User.findByPk(delete_id)
            if (!user) return res.status(400).send('user not found')

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
            return res.status(400).send(err.message)
        }
    }

    async update(req, res) {
        let file = req.file
        let uuid = req.body.user_uuid
        let data = req.body
        try {
            let user = await User.findByPk(uuid)

            if (!user) return res.status(404).json({ code: 404, name: "Not found", message: "user not found!" })

            let result = await uploadFile(file)

            let imgUrl = process.env.APP_DOMAIN + "/images/" + result.key

            data.user_img = imgUrl

            await user.update({ ...data, user_email: undefined })

            return res.json({ code: 0, name: "", message: "update user success" })

        } catch (error) {
            console.log(error)
            return res.json({ code: 0, name: "", message: "Something error" })
        }
    }

    async create(req, res) {
        let userData = req.body
        try {
            let checkUser = await User.findOne({ where: { user_email: userData.user_email } })
            if (checkUser) return res.json({ msg: "email exist!" })

            await User.create(userData)
            return res.json({ code: 201, name: "Created", message: "Create user successfully" })
        } catch (error) {
            console.log(error)
            return res.json({ code: 0, name: "", message: "Something error!" })
        }
    }

    async getInvoices(req, res) {
        let user_uuid = req.params.uuid
        try {
            let invoices = await Invoice.findAll({ where: { user_uuid: user_uuid } })
            return res.json({ message: "success", data: invoices })

        } catch (error) {
            console.log(error)
            return res.json({ code: 0, name: "", message: "Something error!" })
        }
    }
}

const userController = new UserController
module.exports = userController