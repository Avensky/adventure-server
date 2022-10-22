const mongoose         = require('mongoose')
const Memory = mongoose.model("Memory");

exports.getMemory = (req, res) => {
    console.log('req.params.id', req.params)
    console.log('req.params.id', req.params.id)
    Memory.findOne({
        _id : req.params.id
    },{},(err,doc)=>{
        if(doc){
            console.log('doc = ', doc)
            res.json(doc);
        }
        else {
            res.status(404).send('Ops!Detail not found');
        }
    });
};


exports.getMemories = (req,res) =>{          //get all items info from db
    Memory.find({},(err,doc)=>{
        if(doc)
            res.json(doc);
        else {
            res.status(404).send('Ops!'+err)
        }
    })
}

exports.memoryById = async id => {
    const memory = await Memory.findById(id);
    return memory;
}
exports.createMemory = async (req,res) => {
    console.log('req.file', req.file)
    
    //parse the json object to extract body
    //const memoryData = JSON.parse(JSON.stringify(req.body.memoryData));
    //console.log('req.body', (req.body))
    //console.log('req', req)
    //const obj = JSON.parse(req.body)
    //const obj = JSON.parse(JSON.stringify(req.body));
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log('req.body', obj)
    //console.log('address', obj.address)

    //save data to database
    const memoryObj = {
        title       : obj.title,
        imageName   : req.file.key, 
        imageUrl    : req.file.location,
        address     : obj.address,
        location    : {
            lat: Number(obj.lat),
            lng: Number(obj.lng)
        }
    }
    console.log('memoryObj', memoryObj)
    const newMemory = await Memory.create(memoryObj);
    
    return res.json(newMemory)
    
}
exports.removeMemory = async id => {
    const memory = await Memory.findByIdAndRemove(id);
    return memory
}