const {
    canDeleteStaff,
    canUpdateStaff,
    canCreateStaff
} = require('../permissions/staff')
class StaffMiddleware {
    async authDeleteStaff(req, res, next) {
        if (!(await canDeleteStaff(req.user))) {
            return res.status(403).send("Don't have permission!")
        }

        return next()
    }

    async authUpdateStaff(req, res, next) {
        if (!(await canUpdateStaff(req.user, req.params.id))) {
            return res.status(403).send("Don't have permission!")
        }

        return next()
    }

    async authCreateStaff(req, res, next) {
        if (!(await canCreateStaff(req.user))) {
            return res.status(403).send("Don't have permission!")
        }

        return next()
    }
}

const staffMiddleware = new StaffMiddleware
module.exports = staffMiddleware