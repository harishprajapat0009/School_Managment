const express = require('express');

const routes = express.Router();

const adminCtl = require('../../../../controllers/api/v1/adminctl');
const passport = require('passport');

// Authentication
routes.post('/adminRegister', adminCtl.adminRegister);
routes.post('/adminLogin', adminCtl.adminLogin);

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

routes.get('/changePassword/', passport.authenticate('jwt', {failureRedirect : '/api/adminUnauthorised'}), adminCtl.changePassword);

routes.get('/adminLogout/', passport.authenticate('jwt', {failureRedirect : '/api/adminUnauthorised'}), adminCtl.adminLogout);

module.exports = routes
