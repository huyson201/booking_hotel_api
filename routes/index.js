const siteRoute = require("./site")
const hotelRoute = require("./hotel")
const roomRoute = require("./room")
const userRoute = require("./user")
const invoiceRoute = require("./invoice")
const staffRoute = require("./staff")
const serviceRoute = require('./service')
const hotelServiceRoute = require('./hotelservice')
const authMiddleware = require('../middleware/auth')
const rateRoute = require('./rate')
const route = (app) => {
    app.use('/', siteRoute)
    app.use('/hotels', hotelRoute)
    app.use('/rooms', roomRoute)
    app.use('/users', authMiddleware.checkToken, userRoute)
    app.use('/invoices', invoiceRoute)
    app.use('/staffs', staffRoute)
    app.use('/services', serviceRoute)
    app.use('/hotel-services', hotelServiceRoute)
    app.use('/rates', rateRoute)
}

module.exports = route