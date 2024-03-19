const mongoose = require('mongoose')
const optionSchema = new mongoose.Schema({
    name: {
        type: String, 
        require: true,
        unique: true
    }
})

const optionModel = mongoose.model('option',optionSchema)

module.exports = optionModel



/*f
[
    {
        "_id": "65e7c9c14ed1024f2beac8bf",
        "name": "Royal Challengers Bangalore",
        "__v": 0
    },
    {
        "_id": "65e7c9e54ed1024f2beac8c2",
        "name": "Kolkata Knight Riders",
        "__v": 0
    },
    {
        "_id": "65f684cd6c72c94b60566016",
        "name": "Gujarat Titans",
        "__v": 0
    },
    {
        "_id": "65f685066c72c94b60566019",
        "name": "Chennai Super Kings",
        "__v": 0
    },
    {
        "_id": "65f6851e6c72c94b6056601c",
        "name": "Delhi Capitals",
        "__v": 0
    },
    {
        "_id": "65f685326c72c94b6056601f",
        "name": "Lucknow Super Giants",
        "__v": 0
    },
    {
        "_id": "65f685406c72c94b60566022",
        "name": "Mumbai Indians",
        "__v": 0
    },
    {
        "_id": "65f685556c72c94b60566025",
        "name": "Punjab Kings",
        "__v": 0
    },
    {
        "_id": "65f685646c72c94b60566028",
        "name": "Rajasthan Royals",
        "__v": 0
    },
    {
        "_id": "65f6857c6c72c94b6056602b",
        "name": "Sunrisers Hyderabad",
        "__v": 0
    }
]
*/