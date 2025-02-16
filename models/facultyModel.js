const mongoose = require('mongoose');

const facultySchema = mongoose.Schema({
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
    },
    adminId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'AdminModel',
    },
    studentIds : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'StudentModel',
    }],
    status : {
        type : Boolean,
        default : true,
    }
},{timestamps : true});

const facultyModel = mongoose.model('facultyModel', facultySchema);

module.exports = facultyModel;