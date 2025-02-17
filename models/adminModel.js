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
    },
    facultyIds : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'FacultyModel',
        }],
    status : {
        type : Boolean,
        default : true,
    }
},{timestamps : true});

const AdminModel = mongoose.model('AdminModel', adminSchema);

module.exports = AdminModel;