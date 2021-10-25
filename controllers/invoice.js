const { Invoice } = require('../models')
class InvoiceController {
    async index(req, res) {
        try {
            let invoices = await Invoice.findAll()
            return res.json({ code: 200, name: "", message: "", data: invoices })
        } catch (error) {
            console.log(error)
            return res.json({ message: "Something error!" })
        }
    }

    async getById(req, res) {
        let id = req.params.id
        if (!id) return res.status(404).json({ code: 404, name: "Not found", message: "Invoice's id not found!" })
        try {
            let invoice = await Invoice.findByPk(id)
            return res.json({ code: 200, name: "", message: "success", data: invoice })
        } catch (error) {
            console.log(error)
            return res.json({ message: "Something error!" })
        }
    }

    async create(req, res) {
        let invoiceData = req.body
        invoiceData.user_uuid = req.user.user_uuid

        try {
            await Invoice.create(invoiceData)
            return res.json({ code: 200, name: "", message: "success", data: invoiceData })
        } catch (error) {
            console.log(error)
            return res.json({ message: "Something error!" })
        }
    }
}

const invoiceController = new InvoiceController
module.exports = invoiceController