const jwt = require('jsonwebtoken');
const { User, Hotel } = require("../models")
class AuthMiddleware {
    async checkToken(req, res, next) {
        let token

        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1]
            try {
                let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
                req.user = decoded
                return next()
            }
            catch (err) {
                return res.status(401).send(err.message)
            }


        }

        return res.status(401).send('Invalid token provided.');
    }

    async checkHotelOwnerPermission(req, res, next) {
        let user_uuid = req.user.user_uuid
        if (!user_uuid) return res.status(401).json({ code: 401, name: "Access denied", message: "Invalid user_uuid provided." })
        try {
            let user = await User.findOne({ where: { user_uuid } })
            if (!user) return res.status(404).json({ code: 0, name: "Not found", message: "User not found" })

            if (user.user_role !== 1) return res.status(401).json({ code: 401, name: "Access denied", message: "User don't have permission" })

            return next()

        } catch (error) {
            console.log(error)
            return res.json({ code: 0, name: "", message: "something error" })
        }
    }

    async checkOwnerOfHotel(req, res, next) {
        let user_uuid = req.user.user_uuid
        let { hotel_id } = req.body

        if (!hotel_id) return res.status(404).json({ code: 404, name: "Not found", message: "hotel_id not found!" })

        try {
            let hotels = await Hotel.findOne({ where: { hotel_id: +hotel_id, user_uuid } })
            if (!hotels) return res.status(401).json({ code: 401, name: "Access denied", message: "User don't have permission" })
            return next()

        } catch (error) {
            console.log(error)
            return res.json({ code: 0, name: "", message: "something error" })
        }
    }

    async checkAdminRole(req, res, next) {
        let user = req.user
        if (!user) return res.status(401).send('unauthorized')

        if (user.user_role === 0) return next()

        return res.status(403).send(`user don't have permission`)
    }
}
const authMiddleware = new AuthMiddleware
module.exports = authMiddleware