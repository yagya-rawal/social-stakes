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
        type: String,
        require: true
    }
})

const eventModel = mongoose.model('event',eventSchema)

module.exports = eventModel