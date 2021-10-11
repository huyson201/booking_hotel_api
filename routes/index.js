const siteRoute = require("./site")
const hotelRoute = require("./hotel")
const route = (app) => {
    app.use('/', siteRoute)
    app.use('/hotels', hotelRoute)
}

module.exports = route