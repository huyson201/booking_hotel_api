
class SiteController {
    index(req, res) {
        return res.json({ msg: "welcome" })
    }
}
const siteController = new SiteController

module.exports = siteController