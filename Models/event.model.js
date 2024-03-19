const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    options:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'option',
        require: true
    },
    cutoff: {
        type:  Date,
        require: true
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'option',
        require: false,             
        default: null
    },
    isFinished: {
        type: Boolean,
        require: false,
        default: false
    }
})

const eventModel = mongoose.model('event',eventSchema)

module.exports = eventModel