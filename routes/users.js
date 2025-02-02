const express = require("express");
const router = express.Router();
const bycript = require('bcryptjs');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
/*
router.get('/register', (req, res) => 
      res.render('register')
);*/

//Register Handle
/*
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
*/
//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
          successRedirect: '/dashboard',
          failureRedirect: '/users/login',
          failureFlash: true
    })(req, res, next);
});
 

          // Set The Storage Engine
          const storage = multer.diskStorage({
            destination: function(req, file, cb){
                  cb(null, './public/imagesDB')
              },
              filename: function(req, file, cb){
                  cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
              }
            });

          // Init Upload
           const upload = multer({
            storage: storage,
            limits:{fileSize: 1000000},
            fileFilter: function(req, file, cb){
                  checkFileType(file, cb);
            }
            }).single('myImage' );
            
            // Check File Type
            function checkFileType(file, cb){
                  // Allowed ext
                  const filetypes = /jpeg|jpg|png/;
                  // Check ext
                  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                  // Check mime
                  const mimetype = filetypes.test(file.mimetype);
          
                  if(mimetype && extname){
                        return cb(null,true);
                  } else {
                        cb('Error: Images Only!');
                  }
                  }
      

router.post('/dashboard', (req, res) => {
     
            upload(req, res, (err) => {
                  if(err){
                        console.log('error' + err);
                  } else {
                        if(req.file == undefined){
                              console.log('no image loaded');
                        } else {
                              console.log('updated');
                  if(req.body.name){
                        var img = fs.readFileSync(req.file.path);
                        var encode_image = img.toString('base64');

                  const newPlayer = new Player({
                        name: req.body.name,
                        position: req.body.position,
                        number: req.body.number,
                        imgUrl: req.file.path.substring(7, req.file.path.length),
                        contentType: req.file.mimetype,
                        image: new Buffer(encode_image, 'base64'),
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

                  if(req.body.nameNews){
                        // console.log(req.body.description);
                   let value = 0;
                   News.countDocuments( {}, function(err, result){
             
                     if(err){
                         console.log(err)
                     }
                     else{
                         console.log(result)
                         value = result;
                     }
             
                   })
                   .then(value => {
                        var img = fs.readFileSync(req.file.path);
                        var encode_image = img.toString('base64');

                         let pasus = (req.body.description)
                         const newNews = new News({
                               name: req.body.nameNews,
                               description: pasus,
                               imgUrl: req.file.path.substring(7, req.file.path.length),
                               contentType: req.file.mimetype,
                               image: new Buffer(encode_image, 'base64'),
                               url: `newsClone/${value}`
                           });
             
                           newNews.save()
                           .then(news => {
                                req.flash('success_msg', 'You added new news');
                                res.redirect('/dashboard');
                          })
                          .catch(err => console.log(err));
                        })
               }
               }
            }
          });
     
          if(req.body.plyName){
            Player.deleteOne({ name : req.body.plyName }, function(err) {
                  if (!err) {
                        req.flash('success_msg', 'Player deleted');
                        res.redirect('/dashboard');                 
                  }else {
                        req.flash('error_msg', 'Error');
                        res.redirect('/dashboard');   
                  }
              });
          }

          if(req.body.newsNm){
            News.deleteOne({ name : req.body.newsNm }, function(err) {
                  if (!err) {
                        req.flash('success_msg', 'News deleted');
                        res.redirect('/dashboard');                 
                  }else {
                        req.flash('error_msg', 'Error');
                        res.redirect('/dashboard');   
                  }
              });
          }
});





//Logout Handle
router.get('/logout', (req, res) => {
      req.logOut();
      req.flash('success_msg', 'You are logged out');
      res.redirect('/users/login');
})

module.exports = router;