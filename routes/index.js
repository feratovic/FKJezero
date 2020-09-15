const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const Player = require('../models/Players');
const News = require('../models/News');

//Welcome page
router.get('/admin', (req, res) => 
      res.render('welcome')
);

//Dashboard page
router.get('/dashboard', (req, res) => 

      News.find({ }).sort({ date : -1})
          .then( results => {
               Player.find()
                     .then( results2 => {
                            res.render('dashboard', {
                                player: results2,
                                name: req.user.name,
                                news: results
                              })
                        })
                  .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    
);


module.exports = router;