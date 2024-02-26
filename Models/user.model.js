const { Double } = require('bson')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    totalBets: {
        type: Number,
        require: false,
        default: 0
    },
    currentScore: {
        type: Double,
        require: false,
        default: 0
    }
})

const userModel = mongoose.model('user',userSchema)

module.exports = userModel