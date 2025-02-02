const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(express.static('public'));

require('dotenv').config()

//Passport congif
require('./config/passport')(passport);

//server log
app.use((req, res, next) => {
   
   // console.log("Request time!");
    req.requestTime = (new Date()).toString();
    const log = `${req.requestTime} -> Method: ${req.method}; URL:${req.url}; IP -> ${req.ip}`;
    if(!req.url.includes("/socket.io/?X_LOCAL_SECURITY_COOKIE") ){
    fs.appendFile("server log", log + "\n", (err) => {
       // console.log("append");
        if(err){
            console.log(err);
        }
    })
}
   // console.log(log);
    next();
})


//DB Config
mongoose.connect(process.env.MONGODB_VAR || process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Express Session
app.use(session({
    secret: 'secet',
    resave: true,
    saveUninitialized: true
}));



//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes 
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/', require('./routes/pages'))

const PORT = process.env.PORT || 5050;

app.listen(PORT, console.log(`Server started on port ${PORT}`));