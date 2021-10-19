const siteRoute = require("./site")
const hotelRoute = require("./hotel")
const roomRoute = require("./room")
const userRoute = require("./user")
const invoiceRoute = require("./invoice")
const staffRoute = require("./staff")
const route = (app) => {
    app.use('/', siteRoute)
    app.use('/hotels', hotelRoute)
    app.use('/rooms', roomRoute)
    app.use('/users', userRoute)
    app.use('/invoices', invoiceRoute)
    app.use('/staffs', staffRoute)
}

module.exports = route