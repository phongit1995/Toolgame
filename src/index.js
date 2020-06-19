require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const request = require("request-promise");
const cheerio = require('cheerio');
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');
var cors = require('cors')
let app = express();
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret : "etcdongha",
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 60*60*1000 }
}))
app.post("/api",async(req,res)=>{
    
})
app.post("/getdataweb",async(req,res)=>{
    try {
        let options = {
            url:req.body.url,
            method:"get"
        }
        let listresult = [];
        let data = await request(options);
        if(req.body.url.includes("txt")){
            data= data.split('\n');
            console.log( data.length);
        }
        else {
            let $ = cheerio.load(data);
            data = $(".contents").text();
            data= data.split('\n');
        }
         data.forEach(item=>{
            let arraySplit = item.split("|");
            if(arraySplit.length>2){
                listresult.push({
                    key:uuidv4(),
                    username:arraySplit[0],
                    password:arraySplit[1],
                    status:'chưa check',
                    nickname:0,
                    vippoint:0,
                    goldbalance:0,
                    coinbalance:0,
                    stockbalance:0,
                    mobile:0,
                    telesafe:0
                })
            }
        })
        listresult = _.uniqBy(listresult,'username');
        return res.json({
            status:"success",
            data:listresult
        })
    } catch (error) {
        console.log(error);
    }
    
})
app.listen(process.env.PORT||3000,function(){
    console.log("server running on port :" + process.env.PORT||3000)
})