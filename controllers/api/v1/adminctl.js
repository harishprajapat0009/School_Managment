const AdminModel = require('../../../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
                return res.status(200).json({msg : "Login Successfully", Token : adminToken});
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
        return res.status(200).json({msg : "Admin Profile found", adminData : req.user}); 
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err});
    }
};

module.exports.editAdminProfile = async (req, res) => {
    try{
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
            return res.status(400).json({msg : "Admin not found"});
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