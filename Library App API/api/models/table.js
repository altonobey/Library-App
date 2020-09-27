const mongoose = require('mongoose');

const tableSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    number: Number, 
    description: {type: String, required : true},
    image: {type: String, required : false},
    availability: Number,
    floor: Number,
    floor_image: String,
    table_image: String
});

module.exports = mongoose.model('Table', tableSchema);