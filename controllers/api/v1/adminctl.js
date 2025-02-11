const adminModel = require('../../../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.adminRegister = async (req, res) => {
    try{
        let checkAdmin = await adminModel.findOne({email : req.body.email});
        if(!checkAdmin){
            if(req.body.password == req.body.confirmPassword){
                req.body.password = await bcrypt.hash(req.body.password,10);
                let adminData = await adminModel.create(req.body);
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
        let checkAdmin = await adminModel.findOne({email : req.body.email});
        
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
}