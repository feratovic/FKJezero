const express = require("express");
const router = express.Router();

const Player = require('../models/Players');
const News = require('../models/News');

const scrap = require("../scrapers/scraper");
const scrapPlayer = require("../scrapers/scraperPlayer");
const scrapGames = require("../scrapers/scraperGames");
const upadatePlayer = require("../scrapers/updatePlayers");

const fs = require('fs');
const dateFormat = require('dateformat');



let rawdata = fs.readFileSync('./json/tabela.json');
let tabela = JSON.parse(rawdata);

let rawdata2 = fs.readFileSync('./json/fixture.json');
let fix = JSON.parse(rawdata2);


for(let k = fix.fixture.length-1; k>0; k--){

      let str = fix.fixture[k].date;

      let year = str.substring(6,10);
      let month = str.substring(3,5);
      let day = str.substring(0,2);
      let hour = str.substring(11, str.length);
      let date = new Date(year + ' ' + month + ' ' + day + ' ' + hour +':00 GMT');
      let tempDate = Date.parse(date);
      let now = Date.now();
      
      if(now > tempDate){
            delete fix.fixture[k];
      }
     // console.log('date now ' + now);
      
}

//Home page
router.get('/',  function (req, res) {
    //  console.log(fix.fixture);
      News.find({ }).sort({ date : -1})
                .then( results => {
                  res.render('home',
                  {
                        news: results,
                        data: tabela.table,
                        game: fix.fixture[fix.fixture.length-1]
                  })
            })
                .catch((err) => console.log(err))
      }
);

router.post('/', function(req, res) {
      if(req.body.newsUrl){

            var url = req.body.newsUrl;
            //console.log("Post method " + url);
            /* save nom to database */
            res.redirect('/news/' + url);

      }
});

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

router.get('/news/newsClone/:id',  (req, res) => 
      /* if nom exists in database -> return ejs template with vars */
      /* else return 404 */
      News.find( {url: 'newsClone/' + req.params.id })
          .then( results => {
            res.render('newsClone',
            {
                  news: results
            })
          }) 
          .catch((err) => console.log(err))
);
    

router.use('/news', (req, res) => {

      if (req.method === 'GET') {
            News.find({ }).sort({ date : -1})
                .then( results => {
                  res.render('news',
                  {
                        news: results
                  })
            })
                .catch((err) => console.log(err))
               

      } else if( req.method === 'POST'){
            
          
            if(req.body.search){
          
                  var search = req.body.search;
                  News.find({ name: {$regex : `${search}`, $options: 'i'} })
                        .then( results => {
                              res.render('news',
                        {
                        news: results
                        })
                  })
                        .catch((err) => console.log(err))

            }else if(req.body.newsUrl){

                  var url = req.body.newsUrl;
                  //console.log("Post method " + url);
                  /* save nom to database */
                  res.redirect('/news/' + url);

            }
      }
});




module.exports = router;