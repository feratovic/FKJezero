const express = require("express");
const router = express.Router();
const bycript = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');
const Player = require('../models/Players');
const News = require('../models/News');


const { Passport } = require("passport");

//Login page
router.get('/login', (req, res) => 
      res.render('login')
);

//Register page
router.get('/register', (req, res) => 
      res.render('register')
);

//Register Handle
router.post('/register', (req, res ) => {
     // console.log(req.body)
    //  res.send('hello');
      const { name, email, password, password2 } = req.body;
      let errors = [];

      //Check required fields
      if(!name || !email || !password || !password2){
            errors.push({msg: 'Please fill in all fields' });
      }

      if(password !== password2){
            errors.push({ msg: 'Passwords do not match' });
      }

      if(password.length < 6){
            errors.push({ msg: 'Password should be at least 6 characters' });
      }

      if(errors.length > 0){
         res.render('register', {
            errors,
            name,
            email,
            password,
            password2
         });
      }else{ 
            // Validation passed
            // res.send('pass');
            User.findOne({ email: email })
                .then(user => {
                      if(user){
                            //User exists
                        errors.push({ msg: 'Email is already registered' });
                        res.render('register', {
                              errors,
                              name,
                              email,
                              password,
                              password2
                           });
                      }else{
                           const newUser = new User({
                                 name,
                                 email,
                                 password
                           });

                            //Hash passwords
                            bycript.genSalt(10, (err, salt) =>
                              bycript.hash(newUser.password, salt, (err, hash) => {
                                if(err) throw err;

                                newUser.password = hash;
                                //Save User
                                newUser.save()
                                       .then(user => {
                                             req.flash('success_msg', 'You are now registed');
                                             res.redirect('/users/login');
                                       })
                                       .catch(err => console.log(err))
                            }) )
                      } 
                });
      }
});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
          successRedirect: '/dashboard',
          failureRedirect: '/users/login',
          failureFlash: true
    })(req, res, next);
});
 

router.post('/dashboard', (req, res) => {
      console.log(req.body);

      if(req.body.name != ''){
      const newPlayer = new Player({
            name: req.body.name,
            position: req.body.position,
            number: req.body.number,
            age: req.body.age,
            games: req.body.games,
            goals: req.body.goals,
            redCartons: req.body.redCartons,
            yellowCartons: req.body.yellowCartons
      });

      newPlayer.save()
      .then(player => {
            req.flash('success_msg', 'You added new player');
            res.redirect('/dashboard');
      })
      .catch(err => console.log(err));
      }
      
});

//Logout Handle
router.get('/logout', (req, res) => {
      req.logOut();
      req.flash('success_msg', 'You are logged out');
      res.redirect('/users/login');
})
module.exports = router;