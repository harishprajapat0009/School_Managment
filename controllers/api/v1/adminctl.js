const AdminModel = require('../../../models/adminModel');
const FacultyModel = require('../../../models/facultyModel.js');
const StudentModel = require('../../../models/studentModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailSent = require('../../../services/nodeMailer');
const passport = require('passport');


module.exports.adminRegister = async (req, res) => {
    try{
        let checkAdmin = await AdminModel.findOne({email : req.body.email});
        if(!checkAdmin){
            if(req.body.password == req.body.confirmPassword){
                req.body.password = await bcrypt.hash(req.body.password,10);
                let adminData = await AdminModel.create(req.body);
                if(adminData){
                    return res.status(200).json({msg : "Admin registered successfully", adminRecord : adminData})
                }
                else{
                    return res.status(200).json({msg : "Admin not registered"})
                }
            }
        }
        else{
            return res.status(200).json({msg : "Email already exist"})
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err})
    }
};

module.exports.adminLogin = async (req, res) => {
    try{
        let checkAdmin = await AdminModel.findOne({email : req.body.email});
        
        if(checkAdmin){
            let checkPassword = await bcrypt.compare(req.body.password, checkAdmin.password);
            if(checkPassword){
                // delete password for security
                checkAdmin.password = undefined
                
                // generate token
                let adminToken = await jwt.sign({adminData : checkAdmin}, 'ADMIN', {expiresIn : '1d'});
                return res.status(200).json({msg : "Admin Login Successfully", Token : adminToken});
            }
            else{
                return res.status(200).json({msg : "Password is wrong"})
            }
        }
        else{
            return res.status(200).json({msg : "Email is wrong"})
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err})
    }
};

module.exports.adminProfile = async (req, res) => {
    try{
        return res.status(200).json({msg : "Admin Profile", adminData : req.user}); 
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err});
    }
};

module.exports.editAdminProfile = async (req, res) => {
    try{
        let isEmailExists = await AdminModel.findOne({email : req.body.email});
        if(!isEmailExists){
            let checkAdmin = await AdminModel.findById(req.params.adminId);
            if(checkAdmin){
                let updateAdmin = await AdminModel.findByIdAndUpdate(req.params.adminId, req.body);
                if(updateAdmin){
                    let newData = await AdminModel.findById(checkAdmin.id)
                    return res.status(200).json({msg : "Admin updated successfully", updatedData : newData});
                }
                else{
                    return res.status(400).json({msg : "Admin not found"});
                }
            }
            else{
                return res.status(400).json({msg : "Admin not updated"});
            }
        }
        else{
            return res.status(400).json({msg : "Email already exist! Try with another"});
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err});
    }
};

module.exports.changePassword = async (req, res) => {
    try{
        let checkCurrentPass = await bcrypt.compare(req.body.currentPass, req.user.password);
        if(checkCurrentPass){
            if(req.body.currentPass != req.body.newPass){
                if(req.body.newPass == req.body.confirmPass){
                    req.body.password = await bcrypt.hash(req.body.newPass, 10);
                    let updatePass = await AdminModel.findByIdAndUpdate(req.user._id, req.body)
                    if(updatePass){
                        return res.status(200).json({msg : "Password updated successfully"});
                    }
                }
                else{
                    return res.status(400).json({msg : "New password and Confirm password is not match"});
                }
            }
            else{
                return res.status(400).json({msg : "Current password and New password is same"});
            }
        }
        else{
            return res.status(400).json({msg : "Current password is wrong"});
        }
    }
    catch(err){
        console.log(err);
        
        return res.status(400).json({msg : "Something went wrong", errors : err});
    }
};

module.exports.adminLogout = async (req, res) => {
    try{
        req.session.destroy(function(err) {
            if(err){
                return false;
            }
            return res.status(200).json({msg : "Admin logout successfully"});
        })
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err});
    }
};

module.exports.sendMail = async (req, res) => {
    try{
        let checkEmail = await AdminModel.findOne({email : req.body.email});
        if(checkEmail){
            let otp = Math.floor(100000 + Math.random() * 900000);

            let email = req.body.email;
            let sbt = "OTP for email verifiction";
            let text = `OTP : ${otp}`;

            const info = emailSent(email, sbt, text);

            const data = {
                email : req.body.email,
                OTP : otp
            }

            if(info){
                return res.status(200).json({msg : "Mail send successfully", data});
            }
            else{
                return res.status(400).json({msg : "Mail not send"});
            }
        }
        else{
            return res.status(401).json({msg : "Email is wrong"});
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err});
    }
};

module.exports.updateForgotPassword = async (req, res) => {
    try{
       let checkEmail = await AdminModel.findOne({email : req.query.email});
       if(checkEmail){
            if(req.body.newPass == req.body.confirmPass){
                req.body.password = await bcrypt.hash(req.body.newPass, 10);
                
                let updatePass = await AdminModel.findByIdAndUpdate(checkEmail.id, req.body);
                
                if(updatePass){
                    return res.status(400).json({msg : "Password updated successfully"});
                }
                else{
                    return res.status(400).json({msg : "Password not updated"});
                }
            }
            else{
                return res.status(400).json({msg : "New password and Confirm password is not match"});
            }
       }
       else{
            return res.status(400).json({msg : "Email is wrong"});
       }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err});
    }
};

module.exports.registerFaculty = async (req, res) => {
    try{
        let isEmailExist = await FacultyModel.findOne({email : req.body.email});
        if(!isEmailExist){
            var gpass = generatePassword();
            var link = "http://localhost:9003/api/facultyLogin";

            let email = req.body.email;
            let sbt = "Login Information";
            let text = `<h1>Faculty Login Details</h1> <p>Email : ${req.body.email}</p> <p>Password : ${gpass}</p> <p>For login click here : ${link}</p>`;

            const info = emailSent(email, sbt, text);

            if(info){
               let bcyptPass = await bcrypt.hash(gpass, 10)
               let addFaculty = await FacultyModel.create({email : req.body.email, password : bcyptPass, userName : req.body.userName, adminId : req.user._id})
               if(addFaculty){
                    let findAdmin = await AdminModel.findById(req.user._id);
                    
                    findAdmin.facultyIds.push(addFaculty.id);

                    await AdminModel.findByIdAndUpdate(req.user._id, findAdmin)

                    return res.status(200).json({msg : "Faculty registered successfully", facultyData : addFaculty});
               }
               else{
                    return res.status(400).json({msg : "Faculty not registered"});
               }
            }
            else{
                return res.status(400).json({msg : "Mail not send"});
            }
        }
        else{
            return res.status(400).json({msg : "Email is already exist"});
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err});
    }
};

module.exports.viewFaculty = async (req, res) => {
    try{
        //Search 
        let Search = '';
        if(req.query.search){
            Search = req.query.search;
        }

        let getAdmin = await AdminModel.findById(req.user._id);

        let getFaculty = getAdmin.facultyIds;

        // Sorting
        if(req.query.sortBy == "asc"){
            var facultyData = await FacultyModel.find({ _id: { $in: getFaculty }, status : true,
                $or : [
                        {userName : {$regex : Search, $options : 'i'}},
                        {email : {$regex : Search, $options : 'i'}}
                ] }).sort({_id : 1});
       }
       else{
            var facultyData = await FacultyModel.find({ _id: { $in: getFaculty }, status : true,
                $or : [
                        {userName : {$regex : Search, $options : 'i'}},
                        {email : {$regex : Search, $options : 'i'}}
                ] }).sort({_id : -1});
       }

        if(facultyData){
            return res.status(200).json({msg : "Faculty data", data : facultyData});
        }
        else{
            return res.status(400).json({msg : "Faculty not found"});
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err});
    }
};

module.exports.changeFacultyStatus = async (req, res) => {
    try{
        let checkFaculty = await FacultyModel.findById(req.body.facultyId);
        if(checkFaculty.status){
            let updateStatus = await FacultyModel.findByIdAndUpdate(req.body.facultyId, {status : false});
            if(updateStatus){
                return res.status(200).json({msg : "Status deactivate successfully"});
            }
            else{
                return res.status(400).json({msg : "Status not change"});
            }
        }
        else{
            let updateStatus = await FacultyModel.findByIdAndUpdate(req.body.facultyId, {status : true});
            if(updateStatus){
                return res.status(200).json({msg : "Status activate successfully"});
            }
            else{
                return res.status(400).json({msg : "Status not change"});
            }
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};

module.exports.viewStudents = async (req, res) => {
    try{
        //Search 
        let Search = '';
        if(req.query.search){
            Search = req.query.search;
        }

        let getAdmin = await AdminModel.findById(req.user._id);

        let getFaculty = getAdmin.facultyIds;

        let facultyData = await FacultyModel.find({ _id: { $in: getFaculty } });

        if(facultyData){
            let getStudent = [];

            facultyData.forEach((v, i) => {
                getStudent = getStudent.concat(v.studentIds); 
            });

            // Sorting
            if(req.query.sortBy == "asc"){
                var studentData = await StudentModel.find({ _id: { $in: getStudent }, status : true,
                    $or : [
                            {userName : {$regex : Search, $options : 'i'}},
                            {email : {$regex : Search, $options : 'i'}}
                    ] }).sort({_id : 1});
            }
            else{
                var studentData = await StudentModel.find({ _id: { $in: getStudent }, status : true,
                    $or : [
                            {userName : {$regex : Search, $options : 'i'}},
                            {email : {$regex : Search, $options : 'i'}}
                    ] }).sort({_id : -1});
            }

            if(studentData){
                return res.status(200).json({msg : "Student data", data : studentData});
            }
            else{
                return res.status(400).json({msg : "Student not found"});
            }
           
        }
        else{
            return res.status(400).json({msg : "Faculty not found"});
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err});
    }
};

module.exports.changeStudentStatus = async (req, res) => {
    try{
        let checkStudent = await StudentModel.findById(req.body.studentId);
        if(checkStudent.status){
            let updateStatus = await StudentModel.findByIdAndUpdate(req.body.studentId, {status : false});
            if(updateStatus){
                return res.status(200).json({msg : "Status deactivate successfully"});
            }
            else{
                return res.status(400).json({msg : "Status not change"});
            }
        }
        else{
            let updateStatus = await StudentModel.findByIdAndUpdate(req.body.studentId, {status : true});
            if(updateStatus){
                return res.status(200).json({msg : "Status activate successfully"});
            }
            else{
                return res.status(400).json({msg : "Status not change"});
            }
        }
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", error : err})
    }
};

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
};




