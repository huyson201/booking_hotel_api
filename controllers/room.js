const { Room } = require('../models')
const { uploadFile } = require('../s3')
class RoomController {
    async index(req, res) {
        try {
            let rooms = await Room.findAll()
            return res.json({ msg: "success", data: rooms })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async getById(req, res) {
        let id = req.params.id
        if (!id) return res.status(404).json({ msg: "id not found!" })
        try {
            let room = await Room.findByPk(id)
            return res.json({ msg: "success", data: room })
        }
        catch (err) {
            console.log(err)
            return res.send(err)
        }
    }

    async create(req, res) {

        let slideImgs = req.files
        if (!slideImgs) return res.status(404).json({ code: 404, name: "Not found", message: "slide images required!" })
        let { room_name, room_price, room_desc, room_area, room_bed, room_num_people, room_quantity, hotel_id } = req.body

        try {
            // upload img
            let roomImgsUrl = []
            for (let img of slideImgs) {
                let result = await uploadFile(img)
                roomImgsUrl.push(result.key)
            }

            let room = await Room.create({ room_name, hotel_id: +hotel_id, room_desc, room_area, room_price, room_bed: +room_bed, room_quantity: +room_quantity, room_num_people: +room_num_people, room_imgs: roomImgsUrl.join() })
            return res.status(201).json({ code: 201, name: "Created", message: "create room successfully!", data: room })
        } catch (error) {
            console.log(error)
            return res.json({ message: "Something error!" })
        }
    }

    async delete(req, res) {
        let room_id = req.body.room_id
        if (!room_id) return res.status(400).send('room id not found')

        try {
            let room = await Room.findByPk(room_id)
            if (!room) return res.status(400).send('room not found')

            await room.destroy()

            return res.status(204).json({ code: 204, name: "REMOVE_ROOM", message: 'successfully' })

        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }
    }
}

const roomController = new RoomController
module.exports = roomController