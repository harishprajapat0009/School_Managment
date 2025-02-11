const mongoose = require('mongoose');

// Offline
// mongoose.connect('mongodb://127.0.0.1:27017/School_Managment');

// Online
mongoose.connect('mongodb+srv://harish_0009:Pass4mongodb@cluster0.xhvdh.mongodb.net/School_Managment');

const db = mongoose.connection;

db.once('open', (err) => {
    if(err){
        console.log(err);
        return false
    }
    console.log("Db is connected")
})