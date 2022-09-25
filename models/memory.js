const mongoose = require('mongoose');
const {Schema} = mongoose;

const MemorySchema = new Schema({
    title       : String,
    imageName   : String,
    imageData   : String,
    imageUri    : String,
    address     : String,
    location: {
        lat: Number,
        lng: Number
    }
})

mongoose.model('Memory', MemorySchema);