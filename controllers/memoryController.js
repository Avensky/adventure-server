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
exports.createMemory = async payload => {
    const newMemory = await Memory.create(payload);
    return newMemory
}
exports.removeMemory = async id => {
    const memory = await Memory.findByIdAndRemove(id);
    return memory
}