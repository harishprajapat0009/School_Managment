const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'ADMIN'
}

const AdminModel = require('../models/adminModel');

passport.use(new JwtStrategy (opts, async function (payload, done) {
    let checkAdmin = await AdminModel.findOne({id : payload.adminData.id});
    if(checkAdmin){
        return done(null, checkAdmin)
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