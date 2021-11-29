const { Hotel, HotelStaff, Room, Invoice, HotelService } = require("../models");
const { uploadFile } = require("../s3");
require("dotenv").config();
class HotelController {
  async index(req, res) {
    try {
      let hotels = await Hotel.findAndCountAll();
      return res.status(200).json({ msg: "success", data: hotels });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  }

  async getById(req, res) {
    let id = req.params.id;
    if (!id) return res.status(404).json({ msg: "id not found" });
    try {
      let hotel = await Hotel.findByPk(id);
      return res.json({ msg: "success", data: hotel });
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  }

  async getRooms(req, res) {
    let id = req.params.id;
    if (!id) return res.status(400).send("id not found");
    const query = {
      where: { hotel_id: id },
    };

    try {
      let rooms = await Room.findAll(query);
      return res.json({ msg: "success", data: rooms });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  }

  async update(req, res) {
    // let user_uuid = req.user.user_uuid;
    let hotel_id = req.params.id;
    if (!hotel_id) return res.status(400).send("hotel's id not found");

    let data = req.body;
    let { services } = req.body;
    console.log(data, "REQ BODY ===============");
    try {
      // upload slide imgs
      let slideImgs = [];
      if (req.files.photos && req.files.photos.length > 0) {
        for (let img of req.files.photos) {
          let result = await uploadFile(img);
          slideImgs.push(process.env.APP_BASE_URL + "/images/" + result.key);
        }
        data.hotel_slide = slideImgs.join();
      }

      let hotel_img = "";
      // upload avatar img
      if (req.files.avatar && req.files.avatar.length > 0) {
        let resultAvt = await uploadFile(req.files.avatar[0]);
        hotel_img = process.env.APP_BASE_URL + "/images/" + resultAvt.key;
        data.hotel_img = hotel_img;
      }
      let hotel = await Hotel.findByPk(hotel_id);
      if (!hotel) return res.status(400).send("hotel not found");

      if (services) {
        services = services.split(",");
        // services = [...new Set(services)]
        const res = await HotelService.destroy({ where: { hotel_id } });
        console.log(res, "result destroy hotel service");
        // create hotel's service
        services.forEach(async (element) => {
          const sv = await HotelService.create({
            hotel_id: hotel_id,
            service_id: element,
          });
          console.log(sv, "create service success");
        });
        delete data.services;
      }

      hotel.update(data);

      return res.status(200).json({
        code: 200,
        name: "updated",
        message: "update hotel successfully!",
        data: hotel,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error.message);
    }
  }

  async getById(req, res) {
    let id = req.params.id;
    if (!id) return res.status(404).json({ msg: "id not found" });
    try {
      let hotel = await Hotel.findByPk(id);
      return res.json({ msg: "success", data: hotel });
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  }

  async getRooms(req, res) {
    let id = req.params.id;
    if (!id) return res.status(400).send("id not found");
    const query = {
      where: { hotel_id: id },
    };

    try {
      let rooms = await Room.findAll(query);
      return res.json({ msg: "success", data: rooms });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  }

  async create(req, res) {
    let user_uuid = req.user.user_uuid;
    let { hotel_name, hotel_star, services } = req.body;
    if (!user_uuid || !hotel_name || !hotel_star || !services)
      return res.json({ code: 0, name: "", message: "hotel's data invalid" });
    if (!req.files.avatar)
      return res.json({
        code: 404,
        name: "Not found",
        message: "Hotel's avatar required!",
      });
    if (!req.files.photos)
      return res.json({
        code: 404,
        name: "Not found",
        message: "Hotel's slide required!",
      });

    let hotel_address = req.body.hotel_address || "";
    let hotel_phone = req.body.hotel_phone || "";
    let hotel_desc = req.body.hotel_desc || "";

    try {
      // upload slide imgs
      let slideImgs = [];
      if (req.files.photos.length > 0) {
        for (let img of req.files.photos) {
          let result = await uploadFile(img);
          slideImgs.push("/images/" + result.key);
        }
      }

      let hotel_img = "";
      // upload avatar img
      if (req.files.avatar && req.files.avatar.length > 0) {
        let resultAvt = await uploadFile(req.files.avatar[0]);
        hotel_img = process.env.APP_BASE_URL + "/images/" + resultAvt.key;
      }

      let hotel = await Hotel.create({
        user_uuid,
        hotel_name,
        hotel_star: +hotel_star,
        hotel_address,
        hotel_phone,
        hotel_desc,
        hotel_img,
        hotel_slide: slideImgs.join(),
      });

      if (services) {
        services = services.split(",");
        // create hotel's service
        services.forEach(async (element) => {
          const sv = await HotelService.create({
            hotel_id: hotel.hotel_id,
            service_id: element,
          });
          console.log(sv, "create service success");
        });
      }

      return res.status(201).json({
        code: 201,
        name: "Created",
        message: "Create hotel successfully!",
        data: hotel,
      });
    } catch (error) {
      console.log(error);
      return res.json({ code: 0, name: "", message: "Something error!" });
    }
  }

  async getStaffs(req, res) {
    let id = req.params.id;
    if (!id) return res.status(400).dend("id not found");
    let { limit, offset, sort } = req.query;
    let query = {};
    // init query
    query = {
      where: { hotel_id: id },
      include: [
        {
          association: "staff_info",
          attributes: [
            "user_uuid",
            "user_name",
            "user_email",
            "user_phone",
            "user_img",
          ],
        },
      ],
    };
    if (limit) query.limit = +limit;

    if (offset) query.offset = +offset;

    if (sort) {
      let col = sort.split(":")[0];
      let value = sort.split(":")[1];
      query.order = [[col, value]];
    }
    try {
      let staffs = await HotelStaff.findAll(query);
      return res.status(200).json({ msg: "success", data: staffs });
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  }

  async getInvoices(req, res) {
    let id = req.params.id;
    const { status } = req.query;
    if (!id) return res.status(400).send("id not found");
    const query = {
      where: { hotel_id: id },
    };
    if (status) {
      query.where.status = status;
    }
    try {
      let invoice = await Invoice.findAll(query);
      return res.status(200).json({ message: "success", data: invoice });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  }

  async getServices(req, res) {
    const id = req.params.id;
    if (!id) return res.status(400).send("hotel id not found!!");

    try {
      let services = await HotelService.findAll({
        where: { hotel_id: id },
        // raw: true,
        attributes: [],
        include: [
          {
            association: "service",
          },
        ],
      });
      console.log(services);
      return res.status(200).json({
        data: services,
        message: "success",
      });
    } catch (error) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  }

  async delete(req, res) {
    let hotel_id = req.params.id;
    if (!hotel_id) return res.status(400).send("hotel_id not found");

    try {
      let hotel = await Hotel.findByPk(hotel_id);
      if (!hotel) return res.status(400).send("room not found");

      await HotelService.destroy({ where: { hotel_id } });
      await hotel.destroy();

      return res
        .status(204)
        .json({ code: 204, name: "REMOVE_ROOM", message: "successfully" });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error.message);
    }
  }
}

const hotelController = new HotelController();
module.exports = hotelController;
