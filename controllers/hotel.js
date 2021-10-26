const { Hotel, HotelStaff, Room, Invoice } = require("../models")
const { uploadFile } = require('../s3')
require('dotenv').config()
class HotelController {
    async index(req, res) {
        try {
            let hotels = await Hotel.findAndCountAll()
            return res.json({ msg: "success", data: hotels })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async getById(req, res) {
        let id = req.params.id
        if (!id) return res.status(404).json({ msg: "id not found" })
        try {
            let hotel = await Hotel.findByPk(id)
            return res.json({ msg: "success", data: hotel })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async getRooms(req, res) {
        let id = req.params.id
        if (!id) return res.status(400).send("id not found")
        const query = {
            where: { hotel_id: id }
        }

        try {
            let rooms = await Room.findAll(query)
            return res.json({ msg: "success", data: rooms })
        }
        catch (err) {
            console.log(err)
            return res.status(400).send(err.message)
        }
    }

    async create(req, res) {
        let user_uuid = req.user.user_uuid
        let { hotel_name, hotel_star } = req.body
        if (!user_uuid || !hotel_name || !hotel_star) return res.json({ code: 0, name: "", message: "hotel's data invalid" })
        if (!req.files.avatar) return res.json({ code: 404, name: "Not found", message: "Hotel's avatar required!" })
        if (!req.files.photos) return res.json({ code: 404, name: "Not found", message: "Hotel's slide required!" })

        let hotel_address = req.body.hotel_address || ""
        let hotel_phone = req.body.hotel_phone || ""
        let hotel_desc = req.body.hotel_desc || ""

        try {
            // upload slide imgs
            let slideImgs = []
            if (req.files.photos.length > 0) {
                for (let img of req.files.photos) {
                    let result = await uploadFile(img)
                    slideImgs.push('/images/' + result.key)
                }
            }

            let hotel_img = ''
            // upload avatar img
            if (req.files.avatar && req.files.avatar.length > 0) {
                let resultAvt = await uploadFile(req.files.avatar[0])
                hotel_img = process.env.APP_BASE_URL + '/images/' + resultAvt.key
            }



            let hotel = await Hotel.create({ user_uuid, hotel_name, hotel_star: +hotel_star, hotel_address, hotel_phone, hotel_desc, hotel_img, hotel_slide: slideImgs.join() })
            return res.status(201).json({
                code: 201,
                name: "Created",
                message: "Create hotel successfully!",
                data: hotel
            })
        } catch (error) {
            console.log(error)
            return res.json({ code: 0, name: "", message: "Something error!" })
        }
    }

    async getStaffs(req, res) {
        let id = req.params.id
        if (!id) return res.status(400).dend('id not found')

        // init query
        const query = {
            where: { hotel_id: id },
            include: [
                {
                    association: 'staff_info',
                    attributes: ['user_uuid', 'user_name', 'user_email', 'user_phone']
                }
            ]
        }

        try {
            let staffs = await HotelStaff.findAll(query)
            return res.status(200).json({ msg: "success", data: staffs })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async getInvoices(req, res) {
        let id = req.params.id
        if (!id) return res.status(400).send("id not found")
        const query = {
            where: { hotel_id: id }
        }

        try {
            let invoice = await Invoice.findAll(query)
            return res.status(200).json({ message: "success", data: invoice })
        }
        catch (err) {
            console.log(err)
            return res.status(400).send(err.message)
        }
    }
}

const hotelController = new HotelController
module.exports = hotelController