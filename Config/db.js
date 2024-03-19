const mongoose = require('mongoose')


const connectDB = async () => {

    try{
        const db = await mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected: " + db.connection.host)
    }catch(err){
        console.log(err)
    }
    
}

module.exports = connectDB