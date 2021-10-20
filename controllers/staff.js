const { HotelStaff, User, sequelize } = require('../models')
class StaffController {
    async index(req, res) {
        try {
            let staffs = await HotelStaff.findAll()
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
        let { staff_id, hotel_id } = req.body
        if (!staff_id || !hotel_id) return res.status(404).json({ code: 404, name: "Not found", message: "Staff_id or hotel_id not found!" })

        try {
            let staff = await HotelStaff.findOne({ where: { staff_id, hotel_id } })
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
        let { user_name, user_email, user_password, user_phone, user_role, hotel_id, staff_role } = req.body
        const t = await sequelize.transaction()
        try {
            // kiểm tra email tồn tại
            let checkUser = await User.findOne({ where: { user_email: user_email } })
            if (checkUser) return res.json({ msg: "email exist!" })

            // tạo mới user
            if (!user_role) user_role = 0

            let user = await User.create({ user_name, user_email, user_password, user_phone, user_role }, { transaction: t })

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
            return res.json({
                code: 0,
                name: "",
                message: "Something error!"
            })
        }
    }
}

const staffController = new StaffController
module.exports = staffController