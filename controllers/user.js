const { User, Invoice, Hotel } = require('../models')
const { uploadFile } = require('../s3')
const { updateScope } = require('../scopes/user')
require('dotenv').config()
class UserController {

    async index(req, res) {
        let { limit, offset, sort } = req.query

        let query = {}

        if (limit) query.limit = +limit

        if (offset) query.offset = +offset

        if (sort) {
            let col = sort.split(':')[0]
            let value = sort.split(':')[1]
            query.order = [[col, value]]
        }
        try {
            let users = await User.findAll(query)
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
        let delete_id = req.params.uuid
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
        let uuid = req.params.uuid
        let data = req.body

        try {
            let user = await User.findByPk(uuid)

            if (!user) return res.status(404).json({ code: 404, name: "Not found", message: "user not found!" })
            let imgUrl = ''
            if (file) {
                let result = await uploadFile(file)

                imgUrl = process.env.APP_BASE_URL + "/images/" + result.key
                console.log(imgUrl)
            }

            if (imgUrl !== '') {
                data.user_img = imgUrl
            }

            await updateScope(req.user.user_role, user, data)

            return res.status(200).json({ data: user })

        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }
    }

    async create(req, res) {
        let userData = req.body
        try {
            let checkUser = await User.findOne({ where: { user_email: userData.user_email } })
            if (checkUser) return res.json({ msg: "email exist!" })

            checkUser = await User.findOne({ where: { user_phone: userData.user_phone } })
            if (checkUser) return res.json({ msg: "phone number exist!" })

            await User.create(userData)
            return res.status(201).json({ code: 201, name: "Created", message: "Create user successfully" })
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
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

    async getHotels(req, res) {
        let user_uuid = req.params.uuid
        try {
            let hotels = await Hotel.findAll({ where: { user_uuid } })
            return res.status(200).json({ data: hotels })
        }
        catch (error) {
            return res.status(400).send(err.message)
        }
    }

    
}

const userController = new UserController
module.exports = userController