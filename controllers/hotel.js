const { Hotel } = require("../models")
const { uploadFile } = require('../s3')
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
        if (!id) return res.status(404).json({ msg: "id not found" })
        let query = {}
        query.include = [
            {
                association: "rooms"
            }
        ]
        try {
            let hotel = await Hotel.findByPk(id, query)
            return res.json({ msg: "success", data: hotel })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async create(req, res) {
        let user_uuid = req.user_uuid
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
            for (let img of req.files.photos) {
                let result = await uploadFile(img)
                slideImgs.push('/images/' + result.key)
            }

            // upload avatar img
            let resultAvt = await uploadFile(req.files.avatar[0])
            let hotel_img = '/images/' + resultAvt.key

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
        if (!id) return res.status(404).json({ msg: "id not found" })

        // init query
        const query = {}
        query.include = [
            {
                association: "staffs"
            }
        ]
        try {
            let hotel = await Hotel.findByPk(id, query)
            return res.json({ msg: "success", data: hotel })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }
}

const hotelController = new HotelController
module.exports = hotelController