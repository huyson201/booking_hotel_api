const siteRoute = require("./site")
const hotelRoute = require("./hotel")
const roomRoute = require("./hotel")
const route = (app) => {
    app.use('/', siteRoute)
    app.use('/hotels', hotelRoute)
    app.use('/rooms', roomRoute)
}

module.exports = route