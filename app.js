const express = require('express');
const port = 9003;

const app = express();
const db = require('./config/db');

app.use(express.urlencoded());

app.use('/api', require('./routes/api/v1/adminroutes'))

app.listen(port, (err) => {
    if(err){
        console.log(err);
        return false;
    }
    console.log(`Server is running on http://localhost:${port}`)
})