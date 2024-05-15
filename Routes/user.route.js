const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../Models/user.model')
const { verifyUser } = require('../authentication')
const Event = require('../Models/event.model')
const EventBet = require('../Models/eventbet.model')
const Option = require('../Models/option.model')

const router = express.Router()


router.post('/user/register', async (req, res) => {

    const result = await User.findOne({ 'userName': req.body.userName })
    if (result) {
        return res.status(404).json("UserName already exists")
    }
    else {

        const hashedPassword = await bcrypt.hash(req.body.password, 10);


        try {
            User.create({
                name: req.body.name,
                email: req.body.email,
                userName: req.body.userName,
                password: hashedPassword,
            })
            res.status(200).send("User Created successfully !! ")
        } catch (error) {
            console.log(error)
        }

    }

})

router.post('/login', async (req, res) => {

    try {
        const user = await User.findOne({
            userName: req.body.userName
        })
        if (!user) return res.status(500).json("User doesn't exist")


        else {
            const hashedPassword = await bcrypt.compare(req.body.password, user.password)

            if (!hashedPassword) {
                return res.status(401).send('Invalid password')
            }

            else {
                const token = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY, async (err, token) => {
                    if (err) {
                        res.status(500).json("Something went wrong")
                    }

                    else
                        res.status(200).json({ 'userId': user._id,'isAdmin': user.isAdmin, token })
                })
            }
        }
    }
    catch (error) {
        res.status(500).send("Error occurred at Server")
    }

})

router.post('/change-password', async (req, res) => {
    const { userName, oldPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ userName });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            console.log(passwordMatch, user.password, oldPassword)
            return res.status(401).json({ error: 'Invalid old password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        console.log(hashedPassword)

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get('/user/:userId/events/new', verifyUser, async (req, res) => {

    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);

    const newEvents = await Event.find({
        cutoff: {
            $gte: yesterday
        }
    }).sort({ cutoff: 1 });

    if (!newEvents)
        res.status(500).send("An error occurred at server")

    else
        res.status(200).json(newEvents)

})

router.get('/user/:userId/events/upcoming', verifyUser, async (req, res) => {

    const events = await Event.find({
        winner: null
    }).sort({ cutoff: 1 })

    if (!events)
        return res.status(500).json("Some error occerred at server")

    const response = await Promise.all(
        events.map(async (event) => {
            var temp = {
                id: event._id,
                name: event.name,
                options: event.options,
                cutoff: event.cutoff
            }

            const tempResponse = await EventBet.findOne({ 'userId': req.params.userId, 'eventId': event._id })

            temp.selected = tempResponse?.optionId

            console.log(temp)
            return temp
        })
    )

    res.status(200).json(response)

})

router.get('/user/:userId/events/completed', verifyUser, async (req, res) => {

    const events = await Event.find({
        winner: { $ne: null }
    }).sort({ cutoff: -1 })

    if (!events)
        return res.status(500).json("Some error occerred at server")

    const response = await Promise.all(
        events.map(async (event) => {
            var temp = {
                id: event._id,
                name: event.name,
                options: event.options,
                cutoff: event.cutoff,
                winner: event.winner
            }

            const tempResponse = await EventBet.findOne({ 'userId': req.params.userId, 'eventId': event._id })

            temp.selected = tempResponse?.optionId
            temp.points = tempResponse?.points

            console.log(temp)
            return temp
        })
    )

    res.status(200).json(response)

})




router.get('/user/:userId/events/old', verifyUser, async (req, res) => {

    const newEvents = await Event.find({
        cutoff: {
            $lt: new Date()
        }
    })

    if (!newEvents)
        res.status(500).send("An error occurred at server")

    else
        res.status(200).json(newEvents)


})




router.put('/user/:userId/events/:eventId', verifyUser, async (req, res) => {

    const today = new Date()

    const event = await Event.findOne({ _id: req.params.eventId })

    if (!event)
        res.status(500).send("An error occurred at server while fetching event")

    if (event.cutoff <= today) {
        return res.status(400).send("Event has started ")
    }

    if (req.body.option == -1) {
        const eventbet = await EventBet.findOneAndDelete({ 'userId': req.params.userId, 'eventId': req.params.eventId })

        if (!eventbet)
            res.status(500).send("An error occurred at server")

        else
            res.status(200).json(eventbet)

    }

    else {

        const option = await Option.findOne({ _id: req.body.option })

        if (!option)
            res.status(500).json("An error occurred at server")

        else {
            if (req.body.option !== event.options[0]._id.toString() && req.body.option !== event.options[1]._id.toString()) {

                res.status(400).json("Bad Request, Wrong option selected")
            }

            else {


                const eventBet = await EventBet.findOne({ userId: req.params.userId, eventId: req.params.eventId })

                if (!eventBet) {
                    const eventbet = await EventBet.create({
                        userId: req.params.userId,
                        eventId: req.params.eventId,
                        optionId: req.body.option
                    })

                    if (!eventbet)
                        return res.status(500).send("An error occurred at server")

                    else {
                        return res.status(200).json(eventbet)
                    }
                }
                else {

                    const eventbet = await EventBet.findOneAndUpdate({ _id: eventBet._id }, { optionId: req.body.option })

                    if (!eventbet)
                        return res.status(500).send("An error occurred at server")

                    else
                        return res.status(200).json(eventbet)

                }
            }
        }
    }
})

router.get('/user/:userId/leaderboard', verifyUser, async (req, res) => {

    const leaderboard = await User.find({}, null, { sort: { currentScore: -1 } })

    if (!leaderboard)
        return res.status(500).send("An error occurred at server")

    else
        return res.status(200).json(leaderboard)

})

router.get('/user/:userId/option/:optionId', verifyUser, async (req, res) => {

    const option = await Option.findOne({ _id: req.params.optionId })

    if (!option) {
        res.status(500).json({ 'error': "couldn't retreive option" })
    }

    else {

        res.status(200).json(option)

    }
})

router.get('/user/:userId/bets', verifyUser, async (req, res) => {

    const eventbets = await EventBet.find({ 'userId': req.params.userId, win: null })

    if (!eventbets) {
        return res.status(500).json("An error occurred at server")
    }

    res.status(200).json(eventbets)

})


router.get('/event/:eventId/bets', verifyUser, async (req, res) => {

    const eventbets = await EventBet.find({
        'eventId': req.params.eventId
    })


    if (!eventbets)
        return res.status(500).json("Error occurred at server")

    console.log('eventbets')
    console.log(eventbets)

    const event = await Event.findOne({ '_id': req.params.eventId })

    if (!event)
        return res.status(500).json("Error occurred at server")

    console.log(event)

    var users = {}

    const getAllUsers = await Promise.all(eventbets.map(async (eventbet) => {
        const user = await User.findOne({ "_id": eventbet.userId })

        const tempUsers = { ...users }

        tempUsers[eventbet.userId] = user.userName

        users = tempUsers

    }))

    console.log(users)

    const betsWithOption0 = eventbets.filter((eventbet) =>
        (eventbet.optionId._id.toString() === event.options[0]._id.toString())
    ).map(eventbet => {
        console.log(eventbet)
        return ({
            "id": eventbet.userId,
            "name": users[eventbet.userId]
        })
    })

    const betsWithOption1 = eventbets.filter((eventbet) =>

        (eventbet.optionId._id.toString() === event.options[1]._id.toString())
    ).map(eventbet => ({
        "id": eventbet.userId,
        "name": users[eventbet.userId]
    }))

    const response = {}

    response[event.options[0]] = betsWithOption0
    response[event.options[1]] = betsWithOption1

    console.log(response)
    return res.status(200).json(response)



})




router.get('/user/:userId/event/:eventId/bets', verifyUser, async (req, res) => {
    try {

        console.log("\n\n" + req.params.eventId)

        const eventbets = await EventBet.find({ 'eventId': req.params.eventId })

        if (!eventbets)
            return res.status(500).json("some error occurred")

        const event = await Event.findOne({ '_id': req.params.eventId })

        if (!event)
            return res.status(500).json("some error occurred")

        console.log(event)

        var opt1 = 0, opt2 = 0
        const option1 = event.options[0], option2 = event.options[1]

        eventbets.map(
            eventbet => {
                console.log(option1)
                console.log(option2)
                console.log(eventbet.optionId)
                if (eventbet.optionId._id.toString() === option1._id.toString())
                    opt1++

                if (eventbet.optionId._id.toString() === option2._id.toString())
                    opt2++

            }
        )

        console.log("option 1 ::" + opt1 + " option2 ::" + opt2)

        const data = {
            option1: opt1,
            option2: opt2
        }

        res.status(200).json(data)

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

router.get('/user/:userId/options', verifyUser, async (req, res) => {
    try {
        const options = await Option.find()

        res.status(200).json(options);
    } catch (err) {
        res.status(500).send("error occurred at server... ");
    }
})

module.exports = router