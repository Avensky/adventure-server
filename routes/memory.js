const mongoose = require('mongoose');
const Memory    = mongoose.model('Memory');

module.exports = function(app) {
    app.post('/api/addMemory', (req,res) => {
        const MemoryObj = new Memory({
            title : req.body.title,
            imageUri: req.body.imageUri,
            address: req.body.address,
            location: {
                lat : req.body.lat,
                lng : req.body.lng
            }
        })
        MemoryObj.save((err)=>{
            if(err)
                res.send('Unable to save Memory data!');
            else
                res.send('Memory data saved!');
        })
    })
}