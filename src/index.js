require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
const request = require("request-promise");
const cheerio = require('cheerio');
const _ = require("lodash");
const { v4: uuidv4 } = require('uuid');
const md5 = require("md5");
var cors = require('cors');
const { join } = require('lodash');
const path = require("path");
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
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/index.html"));
})
app.post("/api",async(req,res)=>{
    const arrayWeb =[
        'http://khanhdang.xyz/AppG88/login.php',
        'http://khanhdang.xyz/AppW88/login.php',
        'http://khanhdang.xyz/AppR88/login.php',
        'http://khanhdang.xyz/AppM365/login.php',
        'http://khanhdang.xyz/AppM365/login.php',
        'http://khanhdang.xyz/AppW365/login.php',
    ]
    try {
        let password= md5(req.body.password);
        let options = {
        method:"post",
        url:arrayWeb[req.body.web],
        headers: {
            'Content-Type': 'application/json'
        },
        timeout:20000,
        body:JSON.stringify({
            Md5Password:password,
            Password:req.body.password,
            Username:req.body.username
            })
        }
    let result = await request(options);
    result = JSON.parse(result);
    if(result.c!=0){
        return res.json({
            status:"Sai Tài Khoản Hoặc Mật Khẩu"
        })
    }
    result = {
        ...req.body,
        nickname:result.d.nickname,
        vippoint:result.d.vipPoint,
        goldbalance:result.d.goldBalance,
        coinbalance:result.d.coinBalance ,
        mobile:result.d.mobile,
        telesafe:result.d.teleSafe
    }
    return res.json({
        status:"success",
        data:result
    })
    } catch (error) {
        return res.json({
            status:"Có Lỗi Xảy Ra"
        })
    }
    
})
app.post("/getdataweb",async(req,res)=>{
    try {
        let options = {
            url:req.body.url,
            method:"get",
            timeout:20000
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
        return res.json({
            status:"Có Lỗi Xảy Ra"
        })
    }
    
})
app.listen(process.env.PORT||3000,function(){
    console.log("server running on port :" + process.env.PORT||3000)
})