const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// For Admin
const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'ADMIN'
}

const AdminModel = require('../models/adminModel');

passport.use(new JwtStrategy (opts, async function (payload, done) {
    let checkAdmin = await AdminModel.findOne({_id : payload.adminData._id});
    if(checkAdmin){
        return done(null, checkAdmin)
    }
    else{
        return done(null, false)
    }
}));

// For Faculty
const facultyopts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'FACULTY'
}

const FacultyModel = require('../models/facultyModel');

passport.use('faculty', new JwtStrategy (facultyopts, async function (payload, done) {
    let checkFaculty = await FacultyModel.findOne({_id : payload.facultyData._id});
    if(checkFaculty){
        return done(null, checkFaculty)
    }
    else{
        return done(null, false)
    }
}));

// For Student
const studentopts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'STUDENT'
}

const StudentModel = require('../models/studentModel');

passport.use('student', new JwtStrategy (studentopts, async function (payload, done) {
    let checkStudent = await StudentModel.findOne({_id : payload.studentData._id});
    if(checkStudent){
        return done(null, checkStudent)
    }
    else{
        return done(null, false)
    }
}));


passport.serializeUser(function(user, done) {
    return done(null, user.id)
});

passport.deserializeUser(async function (id, done) {
    let adminRecord = await AdminModel.findById(id);
    if(adminRecord){
        return done(null, adminRecord);
    }
    else{
        return done(null, false);
    }
});

module.exports = passport;