const siteRoute = require("./site")
const hotelRoute = require("./hotel")
const roomRoute = require("./room")
const userRoute = require("./user")
const invoiceRoute = require("./invoice")
const staffRoute = require("./staff")
const authMiddleware = require('../middleware/auth')
const { authRole } = require('../auth')
const role = require('../config/role')
const route = (app) => {
    app.use('/', siteRoute)
    app.use('/hotels', authMiddleware.checkToken, authRole([role.ADMIN, role.OWNER, role.HOTEL_STAFF]), hotelRoute)
    app.use('/rooms', roomRoute)
    app.use('/users', authMiddleware.checkToken, userRoute)
    app.use('/invoices', invoiceRoute)
    app.use('/staffs', staffRoute)
}

module.exports = route