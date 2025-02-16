const express = require('express');

const routes = express.Router();

const adminCtl = require('../../../../controllers/api/v1/adminctl');
const passport = require('passport');

// Authentication
routes.post('/adminRegister', adminCtl.adminRegister);
routes.post('/adminLogin', adminCtl.adminLogin);

// Admin Profile
routes.get('/adminProfile', passport.authenticate('jwt', {failureRedirect : '/api/adminUnauthorised'}), adminCtl.adminProfile);

routes.get('/adminUnauthorised', async (req, res) => {
    try{
        return res.status(401).json({msg : "Admin Unauthorised! Please login first"});
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err})
    }
});

routes.put('/editAdminProfile/:adminId', passport.authenticate('jwt', {failureRedirect : '/api/adminUnauthorised'}), adminCtl.editAdminProfile);

// Change Password
routes.post('/changePassword/', passport.authenticate('jwt', {failureRedirect : '/api/adminUnauthorised'}), adminCtl.changePassword);

// Logout
routes.get('/adminLogout/', passport.authenticate('jwt', {failureRedirect : '/api/adminUnauthorised'}), adminCtl.adminLogout);

// Forgot Password
routes.post('/sendMail', adminCtl.sendMail);

routes.post('/updateForgotPassword', adminCtl.updateForgotPassword);

// Faculty Register
routes.post('/registerFaculty', passport.authenticate('jwt', {failureRedirect : '/api/adminUnauthorised'}), adminCtl.registerFaculty);

// View Faculty
routes.get('/viewFaculty', passport.authenticate('jwt', {failureRedirect : '/api/adminUnauthorised'}), adminCtl.viewFaculty);

// Change Faculty Status
routes.get('/changeFacultyStatus', passport.authenticate('jwt', {failureRedirect : '/api/adminUnauthorised'}), adminCtl.changeFacultyStatus);

// View Student
routes.get('/viewStudents', passport.authenticate('jwt', {failureRedirect : '/api/adminUnauthorised'}), adminCtl.viewStudents);

// Change Student Status
routes.get('/changeStudentStatus', passport.authenticate('jwt', {failureRedirect : '/api/adminUnauthorised'}), adminCtl.changeStudentStatus);


module.exports = routes
