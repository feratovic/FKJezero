const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


//Welcome page
router.get('/admin', (req, res) => 
      res.render('welcome')
);

//Dashboard page
router.get('/dashboard', (req, res) => 
   res.render('dashboard', {
         name: req.user.name
   })
);


module.exports = router;