const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
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
    facultyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'FacultyModel',
    },
    status : {
        type : Boolean,
        default : true,
    }
},{timestamps : true});

const StudentModel = mongoose.model('StudentModel', studentSchema);

module.exports = StudentModel;