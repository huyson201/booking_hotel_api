const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Hotel } = require('../models')
const { getStreamFile } = require('../s3')
const { Op } = require('sequelize')
const validator = require('validator');
const twilioConfig = require('../config/twilio.js')
const twilioClient = require('twilio')(twilioConfig.accountID, twilioConfig.authToken)
const { generateToken } = require('../utils')
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

            if (!checkPw) return res.json({ msg: "password not invalid" })

            // generate token and refresh token
            let token = generateToken(user, process.env.ACCESS_TOKEN_SECRET, '2h')

            let refreshToken = generateToken(user, process.env.REFRESH_TOKEN_SECRET, '7d')

            // save refresh token to user
            await user.update({ remember_token: refreshToken })

            return res.status(200).json({
                code: 0,
                name: "",
                message: "login successfully",
                data: {
                    user,
                    token: token,
                    refreshToken: refreshToken
                }
            })
        }
        catch (err) {
            console.log(err)
            return res.status(400).send(err.message)
        }
    }

    async register(req, res) {
        let { user_name, user_email, user_password, confirm_password, user_phone } = req.body

        try {
            // kiểm tra email, phone number tồn tại
            let checkUser = await User.findOne({ where: { user_email: user_email } })
            if (checkUser) return res.status(400).json({ msg: "email exist!" })

            // kiểm tra phone number tồn tại

            checkUser = await User.findOne({ where: { user_phone: user_phone } })
            if (checkUser) return res.status(400).json({ msg: "phone number exist!" })

            if (user_password !== confirm_password) return res.status(400).send('Confirm password not math!')
            let user = await User.create({ user_name, user_email, user_password, user_phone, user_role: 1 })

            return res.json({
                code: 0,
                name: "",
                message: "success",
                data: user
            })
        }
        catch (err) {
            console.log(err)
            return res.status(400).send(err.message)
        }

    }

    async logout(req, res) {
        let user_uuid = req.user.user_uuid
        if (!user_uuid) return res.json({ code: 0, name: "", message: "user_uuid not found" })

        try {
            let user = await User.findOne({ where: { user_uuid } })
            if (!user) return res.json({ code: 0, name: "", message: "user_uuid invalid" })

            user.remember_token = ""
            user = await user.save()
            return res.json({ code: 0, name: "LOG_OUT_SUCCESS", message: "logout success" })

        } catch (error) {
            return res.json({ code: 0, name: "", message: "something error!" })
        }
    }

    async refreshToken(req, res) {
        let refreshToken = req.body.refreshToken

        try {
            let user = await User.findOne({ where: { remember_token: refreshToken } })
            if (!user) return res.json({ msg: "refresh token not exist" })
            // check token

            // verify token
            let decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            if (!decoded) return res.json({ err: "token invalid" })

            // generate token and refresh token
            let payload = { ...user.get({ plain: true }), remember_token: undefined, user_password: undefined, createdAt: undefined, updatedAt: undefined }

            let token = generateToken(user, process.env.ACCESS_TOKEN_SECRET, '2h')

            return res.status(200).json({
                code: 200,
                name: "",
                message: "success",
                token: token
            })



        } catch (err) {
            console.log(err)
            return res.status(400).send(err.message)
        }
    }


    async getImage(req, res) {
        let key = req.params.key
        if (!key) return res.status(400).send("not found")

        try {
            let streamFile = getStreamFile(key)
            return streamFile.pipe(res)
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }
    }

    async filter(req, res) {

        let { address, star, max, min, room, adult, from, to } = req.query

        if (!room && !adult) {
            room = 1
            adult = 1
        }
        if (!from || !to) return res.json({ code: 0, name: "", message: "not found date" })
        let dates = [from, to]

        let query = {
            where: {
                [Op.and]: []
            },
        }
        // // add query
        if (address) query.where[Op.and].push({ hotel_address: { [Op.like]: `%${address}%` } })

        if (star) {
            let jsonStar = JSON.parse(star)
            query.where[Op.and].push({ hotel_star: { [Op.in]: jsonStar } })
        }
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

                    }
                    else {
                        let room_empty = roomData.room_quantity - getOrderedQuantity(roomData.invoices)
                        let room_num_people = roomData.room_num_people
                        if (room_empty >= room && (room_num_people * room) >= adult) roomFilter.push(roomData)

                    }
                }
                if (roomFilter.length !== 0) {
                    hotelValue.rooms = roomFilter
                    return hotelValue
                }

            })

            hotels = hotels.filter(el => {
                if (el != null) return el
            })
            return res.json({ msg: "success", data: hotels })
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }

    }

    async sendOTP(req, res) {
        let channel = req.body.channel
        let to = req.body.to
        if (!channel) return res.status(400).send('channel not found')
        if (!to) return res.status(400).send('phone not found')
        let user

        //  check exist user
        switch (channel) {
            case "sms":
                user = await User.findOne({ where: { user_phone: to.replace('+84', '0') } })
                if (!user) return res.status(400).send('email not exist')
                break
            case "email":
                user = await User.findOne({ where: { user_email: to } })
                if (!user) return res.status(400).send('email not exist')
                break;
            default:
                return res.status(400).send("channel invalid")
        }

        try {

            let result = await twilioClient.verify.services(twilioConfig.serviceSID)
                .verifications.create({
                    to: to,
                    channel: channel,
                    locale: 'vi'
                })

            return res.status(200).json({ data: result })

        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }
    }

    async verifyOTP(req, res) {
        const { code, to } = req.body
        if (!code) return res.status(400).send('code not found')
        if (!to) return res.status(400).send('phone not found')



        try {
            await twilioClient.verify
                .services(twilioConfig.serviceSID)
                .verificationChecks.create({
                    to: to,
                    code: code,
                })

            // generate payload of token

            let payload = {}

            if (validator.isEmail(to)) {
                console.log(to)
                let user = await User.findOne({ where: { user_email: to } })
                if (!user) return res.status(400).send("email not exist")

                payload = { user_uuid: user.user_uuid }

            }

            if (validator.isMobilePhone(to, "vi-VN")) {
                let user = await User.findOne({ where: { user_email: to } })
                if (!user) return res.status(400).send("email not exist")
                payload = { user_uuid: user.user_uuid }

            }


            let token = jwt.sign(payload, process.env.RESET_PASSWORD_SECRET, { expiresIn: '5m' })

            return res.status(200).json({ token: token })

        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }
    }

    async resetPassword(req, res) {
        const { new_password, confirm_password } = req.body
        let user_uuid = req.user_uuid

        if (!user_uuid) return res.status(400).send('user uuid not found')
        if (!new_password) return res.status(400).send('new password not found')
        if (!confirm_password) return res.status(400).send('confirm password not found')

        if (new_password !== confirm_password) return res.status(400).send('confirm password invalid')

        try {
            console.log(user_uuid)
            let user = await User.findByPk(user_uuid)
            if (!user) return res.status(400).send('user not found')

            user.user_password = new_password
            await user.save()
            console.log(user.user_name)
            return res.status(204).send('reset password success')

        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
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