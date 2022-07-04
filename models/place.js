const mongoose = require('mongoose');
const {Schema} = mongoose;

const placeSchema = new Schema({
    title: String,
    imageUri: String,
    address: String,
    location: {
        lat: Number,
        lng: Number
    }
})

mongoose.model('Place', placeSchema);