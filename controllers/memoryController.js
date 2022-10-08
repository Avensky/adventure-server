const mongoose         = require('mongoose')
const Memory = mongoose.model("Memory");
exports.getMemory = async () => {
    const memory = await Memory.find();
    return memory;
};
exports.memoryById = async id => {
    const memory = await Memory.findById(id);
    return memory;
}
exports.createMemory = async (req,res) => {
    console.log('req.file', req.file)
    
    //parse the json object to extract body
    const obj = JSON.parse(JSON.stringify(req.body));
    console.log('req.body', obj)
    //console.log('address', obj.address)

    //save data to database
    const newMemory = await Memory.create({
        imageName   : req.file.key,
        imageUrl    : req.file.location,
        address     : obj.address,
        title       : obj.title,
        location    : {
            lng:obj.lng,
            lat:obj.lat
        }
    });
    
    return res.send('Successfully uploaded files!')
    
}
exports.removeMemory = async id => {
    const memory = await Memory.findByIdAndRemove(id);
    return memory
}