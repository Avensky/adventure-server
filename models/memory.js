const mongoose = require('mongoose');
//const {Schema} = mongoose;

const memorySchema = new mongoose.Schema({
    title       : String,
    imageName   : String,
    imageData   : String,
    imageUrl    : String,
    address     : String,
    location: {
        lat: String,
        lng: String
    }
})

//mongoose.model('Memory', MemorySchema);

// create the model for users and expose it to our app
const Memory = mongoose.model("Memory", memorySchema);
module.exports = Memory;
