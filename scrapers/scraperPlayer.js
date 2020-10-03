const cheerio = require("cheerio");
const axios = require("axios");
const fs = require('fs');
var cron = require('cron');

var scrapPly = cron.job('0 0 * * *', function(){

async function fetchHtml(url) {
    try{
        const { data } = await axios.get(url); 
        return data;
    }catch(e){
        console.log("error" + e);
    }
}

async function scarpPlayer(){
    
    var obj = {
        players: []
    };


    const url = "https://fscg.me/klubovi/jezero-40064/?cid=3376040";

    const html = await fetchHtml(url);

    const $ = cheerio.load(html);

    const search = $("body").find("main > div > div > div > div > div > div > #tabContent_1_1 > div > table > tbody > tr > td ").toArray().map((elem) => $(elem).text());
    console.log(search);
    
    for(let i=0; i<search.length; i =i+6){

        obj.players.push({
            name: search[i],
            games: search[i+1],
            min: search[i+2],
            goals: search[i+3],
            yellow: search[i+4],
            red: search[i+5]
        });

    }

    let data = JSON.stringify(obj);

    fs.writeFile('./json/players.json', data, (err) => {
        if(err) console.log(err);
        console.log('Data Writen')
    });

}
    scarpPlayer();
    console.log("scraper player finish");

});
scrapPly.start();
