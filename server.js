require('dotenv').config()
const express = require("express")
const app = express()
const cors = require('cors')
const { sequelize } = require("./models")
const route = require("./routes")


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

route(app)

const server = require("http").createServer(app)
const PORT = process.env.PORT || 3000

async function connectDB() {
    // try {
    //     await sequelize.sync();
    //     console.log('Connection has been established successfully.');
    // } catch (error) {
    //     console.error('Unable to connect to the database:', error);
    // }
}

connectDB()

server.listen(PORT, async () => {
    console.log('server is running on port ' + PORT)

})