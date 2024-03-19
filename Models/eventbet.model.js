const mongoose = require('mongoose')

const eventbetSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
        require: true
    },
    userId: {   
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    optionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'option',
        require: true
    },
    win: {
        type: Boolean,
        require: false,
        default: null
    },
    points: {
        type: Number,
        default: 0.0
    }
})

const eventbetModel = mongoose.model('eventbet',eventbetSchema)

module.exports = eventbetModel