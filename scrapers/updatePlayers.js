const express = require("express");
const fs = require('fs');

const router = express.Router();

const Player = require('../models/Players');

let rawdata = fs.readFileSync('./json/players.json');
let players = JSON.parse(rawdata);
var cron = require('cron');

//console.log(players);
var update = cron.job('0 0 0 * * *', function(){


//console.log(players.players);


for(let i = 0; i < players.players.length; i++){
    ply =  players.players[i];
    let filter = { name: ply.name};
    let update = { goals: ply.goals, games: ply.games, redCartons: ply.red, yellowCartons: ply.yellow };
    Player.findOneAndUpdate( filter, update, {
      new: true,
      useFindAndModify: false
    })
    .then( results => {

    }) 
    .catch((err) => console.log(err))

}

console.log("scraper update finish");

});

update.start();


