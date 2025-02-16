const express = require('express');

const routes = express.Router();

const studentCtl = require('../../../../controllers/api/v1/studentCtl');

const passport = require('passport');

//Faculty Login
routes.post('/studentLogin', studentCtl.studentLogin);

// Faculty Profile
routes.get('/studentProfile', passport.authenticate('student', {failureRedirect : '/api/student/studentUnauthorised'}) , studentCtl.studentProfile);

routes.get('/studentUnauthorised', async (req, res) => {
    try{
        return res.status(401).json({msg : "Student Unauthorised! Please login first"});
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err})
    }
});

routes.put('/editStudentProfile/:studentId', passport.authenticate('student', {failureRedirect : '/api/student/studentUnauthorised'}), studentCtl.editStudentProfile);

// Change Password
routes.post('/changePassword', passport.authenticate('student', {failureRedirect : '/api/student/studentUnauthorised'}), studentCtl.changePassword);

// Logout
routes.get('/studentLogout/', passport.authenticate('student', {failureRedirect : '/api/student/studentUnauthorised'}), studentCtl.studentLogout);

// Forgot Password
routes.post('/sendMail', studentCtl.sendMail);

routes.post('/updateForgotPassword', studentCtl.updateForgotPassword);

module.exports = routes;