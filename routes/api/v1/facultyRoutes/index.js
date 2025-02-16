const express = require('express');

const routes = express.Router();

const facultyCtl = require('../../../../controllers/api/v1/facultyCtl');

const passport = require('passport');

//Faculty Login
routes.post('/facultyLogin', facultyCtl.facultyLogin);

// Faculty Profile
routes.get('/facultyProfile', passport.authenticate('faculty', {failureRedirect : '/api/faculty/facultyUnauthorised'}) , facultyCtl.facultyProfile);

routes.get('/facultyUnauthorised', async (req, res) => {
    try{
        return res.status(401).json({msg : "Faculty Unauthorised! Please login first"});
    }
    catch(err){
        return res.status(400).json({msg : "Something went wrong", errors : err})
    }
});

routes.put('/editFacultyProfile/:facultyId', passport.authenticate('faculty', {failureRedirect : '/api/faculty/facultyUnauthorised'}), facultyCtl.editFacultyProfile);

// Change Password
routes.post('/changePassword', passport.authenticate('faculty', {failureRedirect : '/api/faculty/facultyUnauthorised'}), facultyCtl.changePassword);

// Logout
routes.get('/facultyLogout/', passport.authenticate('faculty', {failureRedirect : '/api/faculty/facultyUnauthorised'}), facultyCtl.facultyLogout);

// Forgot Password
routes.post('/sendMail', facultyCtl.sendMail);

routes.post('/updateForgotPassword', facultyCtl.updateForgotPassword);

// Faculty Register
routes.post('/registerStudent', passport.authenticate('faculty', {failureRedirect : '/api/faculty/facultyUnauthorised'}), facultyCtl.registerStudent);

// View Student
routes.get('/viewStudents', passport.authenticate('faculty', {failureRedirect : '/api/faculty/facultyUnauthorised'}), facultyCtl.viewStudents);

// Change Student Status
routes.get('/changeStudentStatus', passport.authenticate('faculty', {failureRedirect : '/api/faculty/facultyUnauthorised'}), facultyCtl.changeStudentStatus);


module.exports = routes
