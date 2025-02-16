const FacultyModel = require('../../../models/facultyModel');
const StudentModel = require('../../../models/studentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const emailSent = require('../../../services/nodeMailer');

module.exports.studentLogin = async (req, res) => {
    try{
        let checkStudent = await StudentModel.findOne({email : req.body.email});
        
        if(checkStudent){
            let checkPassword = await bcrypt.compare(req.body.password, checkStudent.password);
            if(checkPassword){
                // delete password for security
                checkStudent.password = undefined
                
                // generate token
                let studentToken = await jwt.sign({studentData : checkStudent}, 'STUDENT', {expiresIn : '1d'});
                return res.status(200).json({msg : "Student Login Successfully", Token : studentToken});
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

module.exports.studentProfile = async (req, res) => {
    try{
        return res.status(200).json({msg : "Student Profile", studentData : req.user}); 
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err});
    }
};

module.exports.editStudentProfile = async (req, res) => {
    try{
        let isEmailExists = await StudentModel.findOne({email : req.body.email})
        if(!isEmailExists){
            let checkStudent = await StudentModel.findById(req.params.studentId);
            if(checkStudent){
                let updateStudent = await StudentModel.findByIdAndUpdate(req.params.studentId, req.body);
                if(updateStudent){
                    let newData = await StudentModel.findById(checkStudent.id)
                    return res.status(200).json({msg : "Student updated successfully", updatedData : newData});
                }
                else{
                    return res.status(400).json({msg : "Student not updated"});
                }
            }
            else{
                return res.status(400).json({msg : "Student not found"});
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
                    let updatePass = await StudentModel.findByIdAndUpdate(req.user._id, req.body)
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

module.exports.studentLogout = async (req, res) => {
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
        let checkEmail = await StudentModel.findOne({email : req.body.email});
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
       let checkEmail = await StudentModel.findOne({email : req.query.email});
       if(checkEmail){
            if(req.body.newPass == req.body.confirmPass){
                req.body.password = await bcrypt.hash(req.body.newPass, 10);
                
                let updatePass = await StudentModel.findByIdAndUpdate(checkEmail.id, req.body);
                
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