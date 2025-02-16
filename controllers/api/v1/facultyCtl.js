const FacultyModel = require('../../../models/facultyModel');
const StudentModel = require('../../../models/studentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailSent = require('../../../services/nodeMailer');

module.exports.facultyLogin = async (req, res) => {
    try{
        let checkFaculty = await FacultyModel.findOne({email : req.body.email});
        
        if(checkFaculty){
            let checkPassword = await bcrypt.compare(req.body.password, checkFaculty.password);
            if(checkPassword){
                // delete password for security
                checkFaculty.password = undefined
                
                // generate token
                let facultyToken = await jwt.sign({facultyData : checkFaculty}, 'FACULTY', {expiresIn : '1d'});
                return res.status(200).json({msg : "Faculty Login Successfully", Token : facultyToken});
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

module.exports.facultyProfile = async (req, res) => {
    try{
        return res.status(200).json({msg : "Faculty Profile", facultyData : req.user}); 
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err});
    }
};

module.exports.editFacultyProfile = async (req, res) => {
    try{
        let isEmailExists = await FacultyModel.findOne({email : req.body.email})
        if(!isEmailExists){
            let checkFaculty = await FacultyModel.findById(req.params.facultyId);
            if(checkFaculty){
                let updateFaculty = await FacultyModel.findByIdAndUpdate(req.params.facultyId, req.body);
                if(updateFaculty){
                    let newData = await FacultyModel.findById(checkFaculty.id)
                    return res.status(200).json({msg : "Faculty updated successfully", updatedData : newData});
                }
                else{
                    return res.status(400).json({msg : "Faculty not updated"});
                }
            }
            else{
                return res.status(400).json({msg : "Faculty not found"});
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
                    let updatePass = await FacultyModel.findByIdAndUpdate(req.user._id, req.body)
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

module.exports.facultyLogout = async (req, res) => {
    try{
        req.session.destroy(function(err) {
            if(err){
                return false;
            }
            return res.status(200).json({msg : "Faculty logout successfully"});
        })
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err});
    }
};

module.exports.sendMail = async (req, res) => {
    try{
        let checkEmail = await FacultyModel.findOne({email : req.body.email});
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
       let checkEmail = await FacultyModel.findOne({email : req.query.email});
       if(checkEmail){
            if(req.body.newPass == req.body.confirmPass){
                req.body.password = await bcrypt.hash(req.body.newPass, 10);
                
                let updatePass = await FacultyModel.findByIdAndUpdate(checkEmail.id, req.body);
                
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

module.exports.registerStudent = async (req, res) => {
    try{
        let isEmailExist = await StudentModel.findOne({email : req.body.email});
        if(!isEmailExist){
            var gpass = generatePassword();
            var link = "http://localhost:9003/api/studentLogin";

            let email = req.body.email;
            let sbt = "Login Information";
            let text = `<h1>Student Login Details</h1> <p>Email : ${req.body.email}</p> <p>Password : ${gpass}</p> <p>For login click here : ${link}</p>`;

            const info = emailSent(email, sbt, text);

            if(info){
               let bcyptPass = await bcrypt.hash(gpass, 10)
               let addStudent = await StudentModel.create({email : req.body.email, password : bcyptPass, userName : req.body.userName, facultyId : req.user._id})
               if(addStudent){
                    let findFaculty = await FacultyModel.findById(req.user._id);
                    
                    findFaculty.studentIds.push(addStudent.id);

                    await FacultyModel.findByIdAndUpdate(req.user._id, findFaculty)

                    return res.status(200).json({msg : "Student registered successfully", studentData : addStudent});
               }
               else{
                    return res.status(400).json({msg : "Student not registered"});
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

module.exports.viewStudents = async (req, res) => {
    try{
        //Search 
        let Search = '';
        if(req.query.search){
            Search = req.query.search;
        }

        let getFaculty = await FacultyModel.findById(req.user._id);

        let getStudent = getFaculty.studentIds;

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