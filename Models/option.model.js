
const optionSchema = new mongoose.Schema({
    name: {
        type: String, 
        require: true,
        unique: true
    }
})

const optionModel = mongoose.model('option',optionsSchema)

module.exports = optionModel
