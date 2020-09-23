const cheerio = require("cheerio");
const axios = require("axios");
const fs = require('fs');
var cron = require('cron');



var scrap = cron.job('0 0 0 * * *', function(){
 

async function fetchHtml(url) {
    try{
        const { data } = await axios.get(url); 
        return data;
    }catch(e){
        console.log("error" + e);
    }
}

async function scrapVijesti(){

    var obj = {
        table: []
    };


    const url = "https://fscg.me/takmicenja/telekom-1-cfl/";

    const html = await fetchHtml(url);

    const $ = cheerio.load(html);

    const search = $("body").find("main > div > div > div > div > div > div > #tabContent_1_3 > .competitionTable > .rankings > tbody > tr > td").toArray().map((elem) => $(elem).text());
    
    for(let i=0; i<search.length; i =i+10){

        obj.table.push({
            rank: search[i],
            name: search[i+1],
            matches: search[i+2],
            win: search[i+3],
            draw: search[i+4],
            lose: search[i+5],
            gpls: search[i+6],
            gmin: search[i+7],
            gr: search[i+8],
            bodovi: search[i+9]
        });

    }

    let data = JSON.stringify(obj);

    fs.writeFile('./json/tabela.json', data, (err) => {
        if(err) console.log(err);
        console.log('Data Writen')
    });

}   
   scrapVijesti();
   console.log("scraper tabela finish");
   
});

scrap.start();

//module.exports = scrap;
//module.exports = scrapVijesti();