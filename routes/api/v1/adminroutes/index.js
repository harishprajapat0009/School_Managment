const express = require('express');

const routes = express.Router();

const adminCtl = require('../../../../controllers/api/v1/adminctl')

// Authentication
routes.post('/adminRegister', adminCtl.adminRegister);
routes.post('/adminLogin', adminCtl.adminLogin);

module.exports = routes
