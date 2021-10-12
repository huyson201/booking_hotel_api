const bcrypt = require('bcrypt');
const { User, Hotel, Room, sequelize } = require('../models')
const { uploadFile, getStreamFile } = require('../s3')
const { Op } = require('sequelize')
class SiteController {
    index(req, res) {
        return res.json({ msg: "welcome" })
    }

    async login(req, res) {
        let { user_email, user_password } = req.body
        try {
            let user = await User.findOne({ where: { user_email } })
            if (!user) return res.json({ msg: "email not exist" })
            let checkPw = bcrypt.compareSync(user_password, user.user_password)
            if (checkPw) {
                return res.json({ msg: "success", data: user })
            }

            return res.json({ msg: "password invalid" })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async register(req, res) {
        let { user_name, user_email, user_password, confirm_password, user_phone, user_role } = req.body
        if (confirm_password !== user_password) return res.json({ msg: "confirm password invalid" })
        try {
            // kiểm tra email tồn tại
            let checkUser = await User.findOne({ where: { user_email: user_email } })
            if (checkUser) return res.json({ msg: "email exist!" })

            // tạo mới user
            if (!user_role) user_role = 0

            let user = await User.create({ user_name, user_email, user_password, user_phone, user_role })
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

    async uploadFile(req, res) {
        const file = req.file
        let result = await uploadFile(file)
        console.log(result)
        return res.json({ key: '/images/' + result.key })
    }

    async getImage(req, res) {
        let key = req.params.key
        if (!key) return res.json({ msg: "not found" })

        let streamFile = getStreamFile(key)
        return streamFile.pipe(res)
    }

    async filter(req, res) {
        if (Object.keys(req.query).length === 0) return res.json({ msg: "success", data: [] })
        let { address, star, max, min, room, adult } = req.query
        let query = {
            where: {
                [Op.and]: []
            }
        }

        // add query
        if (address) query.where[Op.and].push({ hotel_address: { [Op.like]: `%${address}%` } })
        if (star) query.where[Op.and].push({ hotel_star: star })
        if (min && max) query.where[Op.and].push({ '$rooms.room_price$': { [Op.and]: [{ [Op.gte]: min }, { [Op.lte]: max }] } })
        // query.where[Op.and].push({ createdAt: { [Op.lte]: new Date() } })
        query.include = [
            {
                association: "rooms",
            }
        ]
        // get data
        try {
            let hotels = await Hotel.findAll(query)
            if (room && adult) {
                hotels = hotels.map((value, index) => {
                    let rooms = value.rooms
                    let filterRooms = []
                    for (let roomValue of rooms) {
                        let room_empty = roomValue.get({ plain: true }).room_empty
                        let room_num_people = roomValue.get({ plain: true }).room_num_people
                        if (room_empty >= room && (room_num_people * room) >= adult) {
                            return value
                        }

                    }

                })

            }
            return res.json({ msg: "success", data: hotels })
        } catch (error) {
            console.log(error)
            return res.send(error)
        }

    }
}
const siteController = new SiteController

module.exports = siteController