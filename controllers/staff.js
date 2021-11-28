const { HotelStaff, User, sequelize } = require('../models')
const role = require('../config/role')
class StaffController {
    async index(req, res) {
        let { user_uuid } = req.query
        const query = { where: {} }
        if (user_uuid) query.where.user_uuid = user_uuid
        try {
            let staffs = await HotelStaff.findAll(query)
            return res.json({
                code: 0,
                name: "",
                message: "success",
                data: staffs
            })
        } catch (error) {
            return res.json({
                code: 0,
                name: "",
                message: "Something error!"
            })
        }
    }

    async getById(req, res) {
        let id = req.params.id
        if (!id) return res.status(404).json({ code: 404, name: "Not found", message: "staff id not found!" })
        try {
            let staff = await HotelStaff.findByPk(id)
            return res.json({
                code: 0,
                name: "",
                message: "success",
                data: staff
            })

        } catch (error) {
            console.log(error)
            return res.json({
                code: 0,
                name: "",
                message: "Something error!"
            })
        }
    }

    async delete(req, res) {
        let staff_id = req.params.id

        try {
            let staff = await HotelStaff.findOne({ where: { staff_id } })
            if (!staff) return res.status(404).json({ code: 404, name: "Not found", message: "Staff not found!" })

            staff = await staff.destroy()
            return res.json({
                code: 0,
                name: "",
                message: "Delete staff successfully"
            })
        } catch (error) {
            console.log(error)
            return res.json({
                code: 0,
                name: "",
                message: "Something error!"
            })
        }
    }

    async create(req, res) {
        let { user_name, user_email, user_password, user_phone, staff_role, hotel_id } = req.body
        const t = await sequelize.transaction()
        try {
            // kiểm tra email tồn tại
            let checkUser = await User.findOne({ where: { user_email: user_email } })
            if (checkUser) return res.json({ msg: "email exist!" })

            checkUser = await User.findOne({ where: { user_phone } })
            if (checkUser) return res.json({ msg: "phone number exist!" })

            // tạo mới user

            let user = await User.create({ user_name, user_email, user_password, user_phone, user_role: role.HOTEL_STAFF }, { transaction: t })

            let staff = await HotelStaff.create({ user_uuid: user.user_uuid, hotel_id, role: staff_role }, { transaction: t })

            await t.commit()

            return res.status(201).json({
                code: 201,
                name: "",
                message: "Create staff successfully!",
                data: staff
            })
        }
        catch (err) {
            await t.rollback();
            console.log(err)
            return res.status(400).send(err.message)
        }
    }

    async update(req, res) {
        let data = req.body
        let staff_id = req.params.id

        try {
            let staff = await HotelStaff.update(data, { where: { staff_id } })
            return res.status(200).json({ message: "update staff successfully", data: staff })
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }
    }

    async getHotel(req, res) {
        let id = req.params.id
        try {
            let staff = await HotelStaff.findByPk(id)
            let hotel = await staff.getHotel()
            return res.status(200).json({ data: hotel })
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }
    }
}

const staffController = new StaffController
module.exports = staffController