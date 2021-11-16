
const authRole = (permissions = []) => {
    return (req, res, next) => {
        if (!permissions.includes(+req.user.user_role)) {
            return res.status(401).send('unauthorized')
        }

        return next()
    }
}

module.exports = { authRole }