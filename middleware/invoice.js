const { HotelStaff, Hotel, Invoice } = require('../models')
const checkUpdatePermission = async (req, res, next) => {
    let user = req.user
    if (!user) return res.status(401).send('unauthorized')

    try {
        let invoice = await Invoice.findOne({ where: { invoice_id: req.body.invoice_id } })

        let hotel_id = invoice.hotel_id

        let hotel = await Hotel.findOne({ where: { hotel_id, user_uuid: user.user_uuid } })

        if (hotel) {
            req.invoice = invoice
            return next()
        }

        let staff = await HotelStaff.findOne({ where: { hotel_id, user_uuid: user.user_uuid } })

        if (staff) {
            req.invoice = invoice
            return next()
        }

        return res.status(403).send("Don't have permission")
    } catch (error) {
        return res.status(400).send(error.message)
    }

}

module.exports = { checkUpdatePermission }