const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const Player = require('../models/Players');
const News = require('../models/News');


//Home page
router.get('/', (req, res) => 
      res.render('home')
);

//Team page
router.get('/team', (req, res) => 
     Player.find()
           .then( results => {
                 res.render('team',
                 {
                       player: results
                 })
           })
           .catch()
);

//History page
router.get('/history', (req, res) => 
      res.render('history')
);

//About page
router.get('/about', (req, res) => 
      res.render('about')
);

//Shop page
router.get('/shop', (req, res) => 
      res.render('shop')
);

//News page
router.get('/news', (req, res) => 
      News.find()
          .then( results => {
            res.render('news',
            {
                  news: results
            })
          })      
);

module.exports = router;