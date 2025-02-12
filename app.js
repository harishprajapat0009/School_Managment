const express = require('express');
const port = 9003;

const app = express();
const db = require('./config/db');

const session = require('express-session');
const passport = require('passport');
const jwtStrategy = require('./config/passport-jwt-strategy');

app.use(express.urlencoded());

app.use(session({
    name : 'admin',
    secret : 'adminKey',
    resave : false,
    saveUninitialized :false,
    cookie : {
        maxAge : 1000*60*60
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', require('./routes/api/v1/adminroutes'))

app.listen(port, (err) => {
    if(err){
        console.log(err);
        return false;
    }
    console.log(`Server is running on http://localhost:${port}`)
})