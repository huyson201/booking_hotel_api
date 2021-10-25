
class UserMiddleware {

    checkUpdateRole(req, res, next) {
        if (req.user.user_role !== 0 && req.user.user_uuid !== req.body.user_uuid) return res.status(401).json({ code: 401, name: "", message: "Don't have permission!" })
        return next()
    }
}

const userMiddleware = new UserMiddleware

module.exports = userMiddleware