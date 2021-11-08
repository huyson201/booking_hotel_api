const { Invoice } = require('../models')
class InvoiceController {
    async index(req, res) {
        const { status } = req.query
        const query = {
            where: {}
        }

        if (status) {
            query.where.status = status
        }

        try {
            let invoices = await Invoice.findAll(query)
            return res.status(200).json({ message: "", data: invoices })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: "Something error!" })
        }
    }

    async getById(req, res) {
        let id = req.params.id
        if (!id) return res.status(400).send('Id not found')
        try {
            let invoice = await Invoice.findByPk(id)
            return res.json({ code: 200, name: "", message: "success", data: invoice })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ message: "Something error!" })
        }
    }

    async create(req, res) {
        let invoiceData = req.body
        invoiceData.user_uuid = req.user.user_uuid

        try {
            await Invoice.create(invoiceData)
            return res.status(201).json({ message: "success", data: invoiceData })
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }
    }

    async update(req, res) {
        let updateData = req.body
        let id = req.params.id
        if (!updateData) return res.status(400).send('Data update not found')

        try {
            let invoice = await Invoice.findByPk(id)
            await invoice.update({ ...updateData, r_date: undefined, p_date: undefined, user_uuid: undefined, hotel_id: undefined, room_id: undefined })
            return res.status(200).json({ message: "update invoice successfully", data: invoice })
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }
    }

    async delete(req, res) {
        let id = req.params.id
        try {
            let invoice = await Invoice.findByPk(id)
            if (!invoice) return res.status(400).send('invoice not found')

            await invoice.destroy()

            return res.status(200).json({ code: 204, name: "REMOVE_INVOICE", message: 'successfully' })
        } catch (error) {
            console.log(error)
            return res.status(400).send(error.message)
        }
    }
}

const invoiceController = new InvoiceController
module.exports = invoiceController