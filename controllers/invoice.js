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

    async update(req, res) {
        let updateData = req.body

        if (!updateData) return res.status(400).send('Data update not found')

        try {
            let invoice_id = updateData.invoice_id
            let invoice = await Invoice.findByPk(invoice_id)
            await invoice.update({ ...updateData, r_date: undefined, p_date: undefined, user_uuid: undefined, hotel_id: undefined, room_id: undefined })
            return res.status(200).json({ message: "update invoice successfully" })
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }
    }
}

const invoiceController = new InvoiceController
module.exports = invoiceController