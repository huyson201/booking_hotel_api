const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const { User, Hotel, sequelize } = require('../models')
const { uploadFile, getStreamFile } = require('../s3')
const { Op } = require('sequelize')
const twilioConfig = require('../config/twilio.js')

const twilioClient = require('twilio')(twilioConfig.accountID, twilioConfig.authToken)

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
            let payload = { ...user.get({ plain: true }), remember_token: undefined, user_password: undefined, createdAt: undefined, updatedAt: undefined }

            let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' })

            let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

            // save refresh token to user
            user.update({ remember_token: refreshToken })

            return res.json({
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
            return res.send(err)
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
            try {
                // check expired
                let { exp } = jwt_decode(refreshToken)
                if (Date.now() >= exp * 1000) return res.json({ msg: "refresh token expired" })

                // verify token
                let decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                if (!decoded) return res.json({ err: "token invalid" })

                // generate token and refresh token
                let payload = { ...user.get({ plain: true }), remember_token: undefined, user_password: undefined, createdAt: undefined, updatedAt: undefined }

                let token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' })
                console.log(user)
                return res.json({
                    code: 0,
                    name: "",
                    message: "success",
                    token: token
                })

            } catch (err) {
                // err
                console.log(err)
                return res.json({ err: "error verify refresh token" })
            }

        } catch (err) {
            return res.json({ err: "something error!" })
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

        try {
            let result = await twilioClient.verify.services(twilioConfig.serviceSID)
                .verifications.create({
                    to: to,
                    channel: channel,
                    locale: 'vi'
                })

            return res.status(200).json({ data: result })

        } catch (error) {
            return res.status(400).send(error.message)
        }
    }

    async verifyOTP(req, res) {
        const { code, to, user_uuid } = req.body
        if (!code) return res.status(400).send('code not found')
        if (!to) return res.status(400).send('phone not found')
        if (!user_uuid) return res.status(400).send('user uuid not found')
        try {
            let result = await twilioClient.verify
                .services(twilioConfig.serviceSID)
                .verificationChecks.create({
                    to: to,
                    code: code,
                })

            let token = jwt.sign({ user_uuid: user_uuid }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '15m' })

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