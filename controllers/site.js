const bcrypt = require('bcrypt');
const { User, Hotel, Room, Invoice, sequelize } = require('../models')
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

        let { address, star, max, min, room, adult } = req.query
        if (!room && !adult) {
            room = 1
            adult = 1
        }
        let dates = ['2010-01-19T07:45:51.000Z', '2010-01-20T07:45:51.000Z']
        let query = {
            where: {
                [Op.and]: []
            },
        }
        // // add query
        if (address) query.where[Op.and].push({ hotel_address: { [Op.like]: `%${address}%` } })
        if (star) query.where[Op.and].push({ hotel_star: star })
        if (min && max) query.where[Op.and].push({ '$rooms.room_price$': { [Op.between]: [+min, +max] } })

        query.include = [
            {
                association: "rooms",
                include: [
                    {
                        association: "invoices",
                        where: {
                            [Op.and]: [{ r_date: { [Op.between]: dates } }, { p_date: { [Op.between]: dates } }]
                        },
                        required: false,
                        left: true
                    }
                ]

            },

        ]
        // get data
        try {
            let hotels = (await Hotel.findAll(query))
            hotels = hotels.map(el => {
                let hotelValue = el.get({ plain: true })
                let rooms = hotelValue.rooms
                let roomFilter = []
                for (let roomData of rooms) {
                    if (roomData.invoices.length === 0) {
                        let room_empty = roomData.room_quantity
                        let room_num_people = roomData.room_num_people
                        if (room_empty >= room && (room_num_people * room) >= adult) roomFilter.push(roomData)
                        // console.log(roomFilter)
                    }
                    else {
                        let room_empty = roomData.room_quantity - getOrderedQuantity(roomData.invoices)
                        let room_num_people = roomData.room_num_people
                        if (room_empty >= room && (room_num_people * room) >= adult) roomFilter.push(roomData)

                    }
                }
                if (roomFilter.length === 0) return
                hotelValue.rooms = roomFilter
                return hotelValue
            })


            return res.json({ msg: "success", data: hotels })
        } catch (error) {
            console.log(error)
            return res.send(error)
        }

    }


}

function getOrderedQuantity(invoices) {
    let roomQuantity = 0
    for (let invoice of invoices) {
        roomQuantity += invoice.room_quantity
    }

    return roomQuantity
}
const siteController = new SiteController

module.exports = siteController