const cheerio = require("cheerio");
const axios = require("axios");
const fs = require('fs');
var cron = require('cron');

var scrapFix = cron.job('0 0 * * *', function(){

async function fetchHtml(url) {
    try{
        const { data } = await axios.get(url); 
        return data;
    }catch(e){
        console.log("error" + e);
    }
}

async function scarpGames(){
    
    var obj = {
        fixture: []
    };


    const url = "https://fscg.me/klubovi/jezero-40064/?cid=3376040&pg=1&tab=fixtures";

    const html = await fetchHtml(url);

    const $ = cheerio.load(html);

    const search = $("body").find("main > div > div > div > div > div > div > #tabContent_1_2 > div > table > tbody > tr > td ").toArray().map((elem) => $(elem).text());
    console.log(search);
    
    for(let i=0; i<search.length; i =i+5){

        obj.fixture.push({
            date: search[i],
            league: search[i+1],
            home: search[i+2],
            guest: search[i+3],
        });

    }

    let data = JSON.stringify(obj);

    fs.writeFile('./json/fixture.json', data, (err) => {
        if(err) console.log(err);
        console.log('Data Writen')
    });

    //return search;
   
}
    scarpGames();
    console.log("scraper fixture finish");

});

scrapFix.start();