const siteRoute = require("./site")
const route = (app) => {
    app.use('/', siteRoute)
}

module.exports = route