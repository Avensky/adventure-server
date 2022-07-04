const mongoose = require('mongoose');
const Place    = mongoose.model('Place');

module.exports = function(app) {
    app.post('/api/addPlace', (req,res) => {
        const placeObj = new Place({
            title : req.body.title,
            imageUri: req.body.imageUri,
            address: req.body.address,
            location: {
                lat : req.body.lat,
                lng : req.body.lng
            }
        })
        placeObj.save((err)=>{
            if(err)
                res.send('Unable to save place data!');
            else
                res.send('Place data saved!');
        })
    })
}