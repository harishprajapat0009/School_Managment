const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
},{timestamps : true});

const adminModel = mongoose.model('adminModel', adminSchema);

module.exports = adminModel;