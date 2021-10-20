
class UserMiddleware {

    checkUpdateRole(req, res, next) {
        if (req.user_role !== 0 && req.user_uuid !== req.body.user_uuid) return res.status(401).json({ code: 401, name: "", message: "Don't have permission!" })
        return next()
    }

    checkCreateRole(req, res, next) {
        console.log(req.user_role)
        if (req.user_role !== 0) return res.json({ code: 401, name: "Access denied", message: "Don't have permission" })
        return next()
    }
}

const userMiddleware = new UserMiddleware

module.exports = userMiddleware