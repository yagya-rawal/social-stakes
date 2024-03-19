const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment-timezone');

const router = express.Router()

const User = require('../Models/user.model.js')
const { verifyAdmin } = require('../authentication.js')
const Event = require('../Models/event.model.js')
const EventBet = require('../Models/eventbet.model.js')
const Option = require('../Models/option.model.js')

const validateEvent = async (event) => {

    if (event.options && event.options[0]) {
        const option1 = await Option.findById(event.options[0])
        if (!option1)
            res.status(500).send("wrong option ")
    }

    if (event.options && event.options[1]) {
        const option2 = await Option.findById(event.options[1])
        if (!option2)
            res.status(500).send("wrong option")
    }
    
    if (event.winner) {
        const winner = await Option.findById(event.winner)
        if (!winner)
            res.status(500).send("wrong option in winner")
    }

}


router.post('/admin/login', async (req, res) => {
    try {
        const user = await User.findOne({
            userName: req.body.userName
        })
        if (!user) return res.status(500).send("User doesn't exist")

        if (!user.isAdmin)
            return res.status(500).send("User not an admin")

        console.log(user)

        const hashedPassword = bcrypt.compare(req.body.password, user.password)

        if (!hashedPassword) {
            return res.status(401).send('Invalid password')
        }

        jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY, async (err, token) => {
            if (err) {
                console.log("couldn't generate token")
                res.status(500).json("Something went wrong")
            }

            res.status(200).send(token)
        })
    }
    catch (error) {
        res.status(500).send("Error occurred at Server")
    }
})


router.post('/admin/event', verifyAdmin, async (req, res) => {

    try {
        const data = {
            name: req.body.name,
            options: req.body.options,
            cutoff: moment(req.body.cutoff).tz('Asia/Kolkata').toDate(),
            winner: req.body.winner,
            isFinished: req.body.isFinished
        }

        console.log(data)

        validateEvent(data)

        const event = Event.create(data)

        if (!event)
            res.status(500).send("Couldn't create event")

        res.status(200).json(event)
    } catch (err) {
        res.status(500).send("Some error occurred at server")
    }

})

router.get('/admin/events/all', verifyAdmin, async (req, res) => {
    try {
        const events = await Event.find()
        res.status(200).json(events);
    } catch (err) {
        res.status(500).send("error occurred at server... ");
    }
});

router.put('/admin/event/:eventId', verifyAdmin, async (req, res) => {

    const event = await Event.findOne({ _id: req.params.eventId })

    if (!event)
        res.status(500).send("An error occurred at server")


    const newEvent = {
        name: req.body.name,
        options: req.body.options,
        cutoff: moment(req.body.cutoff).tz('Asia/Kolkata').toDate(),
        winner: req.body.winner
    }

    validateEvent(newEvent)

    const updated = await Event.findByIdAndUpdate({ _id: req.params.eventId }, newEvent)

    if (!updated)
        res.status(500).send("Couldn't update the event")

    console.log(updated)

    if (!newEvent.winner)
        res.status(200).json(newEvent)

    else {
        const eventbets = await EventBet.find({ eventId: req.params.eventId })

        let winners = 0.0
        let losers = 0.0

        console.log(newEvent.winner)

        eventbets.forEach(bet => {
            if (bet.optionId._id.toString() === newEvent.winner)
                winners++
            else
                losers++

            console.log(bet.optionId._id.toString(), newEvent.winner)
        })

        if(winners == 0 || losers == 0){
            eventbets.forEach(async (bet) => {

                deletedBet = await EventBet.findByIdAndDelete(bet._id)

                console.log(deletedBet)
            })

            return res.status(200).json("Bet cancelled !")
        }
        
        else{

        let winnerpoints = (10*losers) / winners
        let loserpoints = 10

        eventbets.forEach(async (bet) => {

            console.log(bet.optionId._id.toString())

            if (bet.optionId._id.toString() === newEvent.winner)
                bet.points = winnerpoints
            else
                bet.points = -loserpoints

            const user = await User.findById({ _id: bet.userId })

            if(bet.points == 0)
                user.currentScore += bet.points
            else
                user.currentScore += bet.points - user.currentScore

            console.log("bet   " + bet)
            const updatedUser = await User.findByIdAndUpdate(bet.userId, user, {new:true})

            const updatedBet = await EventBet.findByIdAndUpdate(bet._id, bet, {new:true})

            // console.log(updatedUser)
            // console.log(updatedBet)


        })

        res.status(200).json(eventbets)
        }
    }


})

router.post('/admin/option/add', verifyAdmin, async (req, res) => {

    if (req.body.name == "" || !req.body.name)
        res.status(500).send("Wrong data sent")

    const data = {
        name: req.body.name
    }

    const option = Option.create(data)

    if (!option)
        res.status(200).send("an error occurred at server")

    res.status(200).json(option)
})

router.get('/admin/options', verifyAdmin, async (req, res) => {
    try {
        const options = await Option.find()
        //   const events = [];
        res.status(200).json(options);
    } catch (err) {
        res.status(500).send("error occurred at server... ");
    }
})


module.exports = router