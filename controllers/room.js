const { Room, Invoice } = require("../models");
const { uploadFile } = require("../s3");
class RoomController {
  async index(req, res) {
    try {
      let rooms = await Room.findAll();
      return res.json({ msg: "success", data: rooms });
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  }

  async getById(req, res) {
    let id = req.params.id;
    if (!id) return res.status(404).json({ msg: "id not found!" });
    try {
      let room = await Room.findByPk(id);
      return res.json({ msg: "success", data: room });
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  }

  async create(req, res) {
    let slideImgs = req.files;
    if (!slideImgs)
      return res.status(404).json({
        code: 404,
        name: "Not found",
        message: "slide images required!",
      });
    let {
      room_name,
      room_price,
      room_desc,
      room_area,
      room_beds,
      room_num_people,
      room_quantity,
      hotel_id,
      room_services,
      room_surcharge
    } = req.body;
    let data = req.body;
    try {
      // upload img
      let roomImgsUrl = [];
      for (let img of slideImgs) {
        let result = await uploadFile(img);
        roomImgsUrl.push(process.env.APP_BASE_URL + "/images/" + result.key);
      }
      data.room_imgs = roomImgsUrl.join();
      console.log(data, "111111111111111111111111111111");

      let room = await Room.create({
        room_name,
        hotel_id: +hotel_id,
        room_desc,
        room_area,
        room_price,
        room_beds: +room_beds,
        room_quantity: +room_quantity,
        room_num_people: +room_num_people,
        room_imgs: roomImgsUrl.join(),
        room_services,
        room_surcharge
      });
      return res.status(201).json({
        code: 201,
        name: "Created",
        message: "create room successfully!",
        data: room,
      });
    } catch (error) {
      console.log(error);
      return res.json({ message: "Something error!" });
    }
  }

  async delete(req, res) {
    let room_id = req.params.id;
    if (!room_id) return res.status(400).send("room id not found");

    try {
      let room = await Room.findByPk(room_id);
      if (!room) return res.status(400).send("room not found");

      await room.destroy();

      return res
        .status(204)
        .json({ code: 204, name: "REMOVE_ROOM", message: "successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error.message);
    }
  }

  async update(req, res) {
    let slideImgs = req.files;
    let data = req.body;
    try {
      let room = req.room;
      if (!room) return res.status(400).send("room not found");

      // upload img
      let roomImgsUrl = [];
      if (slideImgs) {
        for (let img of slideImgs) {
          let result = await uploadFile(img);
          roomImgsUrl.push(process.env.APP_BASE_URL + "/images/" + result.key);
        }
      }

      if (roomImgsUrl.length > 0) data.room_imgs = roomImgsUrl.join();
      await room.update(data);

      return res.status(204).send("update room successfully");
    } catch (error) {
      console.log(error);
      return res.status(400).send("Something error!");
    }
  }

  async getOrdered(req, res) {
    let room_id = req.params.id;
    if (!room_id) return res.status(400).send("room id not found");
    let { from, to } = req.body;
    try {
      let dateFilter = [from, to];
      const invoices = await Invoice.findAll({
        where: {
          [Op.or]: [
            { r_date: { [Op.between]: dateFilter } },
            { p_date: { [Op.between]: dateFilter } },
          ],
          room_id: room_id,
          status: 3,
        },
      });
      let ordered = getOrderedQuantity(invoices);
      console.log(ordered, "ORDERED");
      return res.status(200).json({ ordered: ordered });
    } catch (error) {
      return res.status(400).send("Something error!");
    }
  }
}

function getOrderedQuantity(invoices) {
  let roomQuantity = 0;
  if (invoices.length === 0) return roomQuantity;

  for (let invoice of invoices) {
    roomQuantity += invoice.room_quantity;
  }

  return roomQuantity;
}
const roomController = new RoomController();
module.exports = roomController;
