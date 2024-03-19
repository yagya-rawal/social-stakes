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
    password: {
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
        type: Number,
        require: false,
        default: 0.0
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const userModel = mongoose.model('user',userSchema)

module.exports = userModel