require('dotenv').config()
const express = require("express")
const app = express()
const cors = require('cors')
const { sequelize } = require("./models")
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const server = require("http").createServer(app)
const PORT = process.env.PORT || 3000


server.listen(PORT, async () => {
    console.log('server is running on port ' + PORT)
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})