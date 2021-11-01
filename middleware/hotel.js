const {
    canGetHotels,
    canGetDetails
} = require('../permissions/hotel')
class HotelMiddleware {
    authGetHotels(req, res, next) {
        if (!canGetHotels(req.user)) {
            return res.status(403).send("Don't have permission")
        }

        return next()
    }

    authGetDetailHotel(req, res, next) {
        if (!canGetDetails(req.user, req.params.id)) {
            return res.status(403).send("Don't have permission")
        }

        return next()
    }
}

const hotelMiddleware = new HotelMiddleware

module.exports = hotelMiddleware