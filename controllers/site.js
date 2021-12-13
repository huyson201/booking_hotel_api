const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Hotel } = require("../models");
const { getStreamFile } = require("../s3");
const { Op } = require("sequelize");
const validator = require("validator");
const twilioConfig = require("../config/twilio.js");
const twilioClient = require("twilio")(
  twilioConfig.accountID,
  twilioConfig.authToken
);
const { generateToken } = require("../utils");
class SiteController {
  index(req, res) {
    return res.json({ msg: "welcome" });
  }

  async login(req, res) {
    let { user_email, user_password } = req.body;
    try {
      let user = await User.findOne({ where: { user_email } });

      if (!user) return res.json({ msg: "Email của bạn không tồn tại" ,code: 0});

      let checkPw = bcrypt.compareSync(user_password, user.user_password);

      if (!checkPw) return res.json({ msg: "Sai mật khẩu",code:1 });

      // generate token and refresh token
      let token = generateToken(user, process.env.ACCESS_TOKEN_SECRET, "2h");

      let refreshToken = generateToken(
        user,
        process.env.REFRESH_TOKEN_SECRET,
        "7d"
      );

      // save refresh token to user
      await user.update({ remember_token: refreshToken });

      return res.status(200).json({
        code: 0,
        name: "",
        message: "login successfully",
        data: {
          user,
          token: token,
          refreshToken: refreshToken,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  }

  async register(req, res) {
    let { user_name, user_email, user_password, confirm_password, user_phone } =
      req.body;

    try {
      // kiểm tra email, phone number tồn tại
      let errors = [];
      let checkUser = await User.findOne({ where: { user_email: user_email } });

      if (checkUser){
        errors.push({ msg: "Email của bạn đã được đăng kí", code: 0 });
        checkUser = await User.findOne({ where: { user_phone: user_phone } });
        if (checkUser) {
          errors.push({ msg: "Số điện thoại của bạn đã được đăng kí", code: 1 });
        }
        return res.json({ errors: errors });
      }
   

      if (user_password !== confirm_password)
        return res.status(400).send("Confirm password not math!");
      let user = await User.create({
        user_name,
        user_email,
        user_password,
        user_phone,
        user_role: 3,
      });

      return res.json({
        code: 0,
        name: "",
        message: "success",
        data: user,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  }

  async logout(req, res) {
    let user_uuid = req.user.user_uuid;
    if (!user_uuid)
      return res.json({ code: 0, name: "", message: "user_uuid not found" });

    try {
      let user = await User.findOne({ where: { user_uuid } });
      if (!user)
        return res.json({ code: 0, name: "", message: "user_uuid invalid" });

      user.remember_token = "";
      user = await user.save();
      return res.json({
        code: 0,
        name: "LOG_OUT_SUCCESS",
        message: "logout success",
      });
    } catch (error) {
      return res.json({ code: 0, name: "", message: "something error!" });
    }
  }

  async refreshToken(req, res) {
    let refreshToken = req.body.refreshToken;

    try {
      let user = await User.findOne({
        where: { remember_token: refreshToken },
      });
      if (!user) return res.json({ msg: "refresh token not exist" });
      // check token

      // verify token
      let decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (!decoded) return res.json({ err: "token invalid" });

      // generate token and refresh token
      let payload = {
        ...user.get({ plain: true }),
        remember_token: undefined,
        user_password: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };

      let token = generateToken(user, process.env.ACCESS_TOKEN_SECRET, "2h");

      return res.status(200).json({
        code: 200,
        name: "",
        message: "success",
        token: token,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send(err.message);
    }
  }

  async getImage(req, res) {
    let key = req.params.key;
    if (!key) return res.status(400).send("not found");

    try {
      let streamFile = await getStreamFile(key);
      return streamFile.pipe(res);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error.message);
    }
  }

  async filter(req, res) {
    const query = {
      where: {},
    };
    let { address } = req.query;

    // process address
    if (address) {
      let addressArr = address.split(",");
      let addressQuery = addressArr.flatMap((value) => [
        { [Op.like]: `%${value.trim()}%` },
      ]);
      query.where.hotel_address = { [Op.and]: addressQuery };
    }

    //  process staff
    let { star } = req.query;
    if (star) {
      let jsonStar = JSON.parse(star);

      query.where.hotel_star = { [Op.in]: jsonStar };
    }

    let hotels = await Hotel.findAll(query);

    // process min max price
    let { min, max } = req.query;

    if (max && min) {
      hotels = await asyncFilter(hotels, async (hotelValue) => {
        let rooms = await hotelValue.countRooms({
          where: { room_price: { [Op.between]: [+min, +max] } },
        });
        return rooms > 0;
      });
    }

    // process dates filter
    let { from, to } = req.query;
    let dateFilter = [from, to];

    hotels = await asyncMap(hotels, async (hotelEl) => {
      let rooms = await hotelEl.getRooms();

      let newRooms = await asyncMap(rooms, async (el) => {
        let invoices = await el.getInvoices({
          where: {
            [Op.or]: [
              { r_date: { [Op.between]: dateFilter } },
              { p_date: { [Op.between]: dateFilter } },
            ],
            status: 3,
          },
        });

        console.log(dateFilter);
        console.log(invoices);
        let orderedQuantity = getOrderedQuantity(invoices);
        let roomPlain = el.get({ plain: true });

        roomPlain.ordered = orderedQuantity;
        return roomPlain;
      });

      let newHotel = hotelEl.get({ plain: true });
      newHotel.rooms = newRooms;
      return newHotel;
    });

    return res.status(200).json({ data: hotels });
  }

  async sendOTP(req, res) {
    let channel = req.body.channel;
    let to = req.body.to;
    if (!channel) return res.status(400).send("channel not found");
    if (!to) return res.status(400).send("phone not found");
    let user;

    //  check exist user
    switch (channel) {
      case "sms":
        user = await User.findOne({
          where: { user_phone: to.replace("+84", "0") },
        });
        if (!user) return res.status(400).send("email not exist");
        break;
      case "email":
        user = await User.findOne({ where: { user_email: to } });
        if (!user) return res.status(400).send("email not exist");
        break;
      default:
        return res.status(400).send("channel invalid");
    }

    try {
      let result = await twilioClient.verify
        .services(twilioConfig.serviceSID)
        .verifications.create({
          to: to,
          channel: channel,
          locale: "vi",
        });

      return res.status(200).json({ data: result });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error.message);
    }
  }

  async verifyOTP(req, res) {
    const { code, to } = req.body;
    if (!code) return res.status(400).send("code not found");
    if (!to) return res.status(400).send("phone not found");

    try {
      await twilioClient.verify
        .services(twilioConfig.serviceSID)
        .verificationChecks.create({
          to: to,
          code: code,
        });

      // generate payload of token

      let payload = {};

      if (validator.isEmail(to)) {
        console.log(to);
        let user = await User.findOne({ where: { user_email: to } });
        if (!user) return res.status(400).send("email not exist");

        payload = { user_uuid: user.user_uuid };
      }

      if (validator.isMobilePhone(to, "vi-VN")) {
        let user = await User.findOne({ where: { user_email: to } });
        if (!user) return res.status(400).send("email not exist");
        payload = { user_uuid: user.user_uuid };
      }

      let token = jwt.sign(payload, process.env.RESET_PASSWORD_SECRET, {
        expiresIn: "5m",
      });

      return res.status(200).json({ token: token });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error.message);
    }
  }

  async resetPassword(req, res) {
    const { new_password, confirm_password } = req.body;
    let user_uuid = req.user_uuid;

    if (!user_uuid) return res.status(400).send("user uuid not found");
    if (!new_password) return res.status(400).send("new password not found");
    if (!confirm_password)
      return res.status(400).send("confirm password not found");

    if (new_password !== confirm_password)
      return res.status(400).send("confirm password invalid");

    try {
      console.log(user_uuid);
      let user = await User.findByPk(user_uuid);
      if (!user) return res.status(400).send("user not found");

      user.user_password = new_password;
      await user.save();
      console.log(user.user_name);
      return res.status(204).send("reset password success");
    } catch (error) {
      console.log(error);
      return res.status(400).send(error.message);
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

async function asyncFilter(array, callBack) {
  let data = [];
  for (let item of array) {
    let check = await callBack(item);
    if (check) {
      data.push(item);
    }
  }

  return data;
}

async function asyncMap(array, callBack) {
  let data = [];
  for (let item of array) {
    let mapItem = await callBack(item);
    data.push(mapItem);
  }

  return data;
}

const siteController = new SiteController();

module.exports = siteController;
