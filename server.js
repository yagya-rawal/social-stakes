const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config()
const connectDB = require('./Config/db')

const path=require('path')



connectDB()

const userRouter = require('./Routes/user.route')
const adminRouter = require('./Routes/admin.route')

const app = express()

const port = 3000

app.use(cors())
app.use(bodyParser.json())
// app.use(express.json())


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
 
app.use(userRouter)

app.use(adminRouter)

app.listen(port, () => console.log('listening on port ' + port))

app.use(express.static(path.join(__dirname, "frontend/build")));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
    })