// node 后端服务器
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');

const expressSession=require('express-session');
const cookie=require('cookie-parser')
const MySqlStore=require('express-mysql-session')(expressSession);

const Leave = require('./api/leave');
const User = require('./api/user');
const Work=require('./api/work')
const config=require('./config/server.json');

const app = express();
app.use(express.static(path.resolve(__dirname, '../public')))
app.use('/favicon.ico', express.static('./public/images/favicon.ico'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookie());
app.use(expressSession({
  secret:"chyingp",
  name:"boyan",
  resave:false,
  saveUninitialized:false,
  cookie:{maxAge:1000 * 60 * 60 * 24 * 30},
  store:new MySqlStore(config.mysql)
}))
app.all('*', function(req, res, next) {  
  res.set({
    'Content-Type': 'text/html',   
  });
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");  
  if(req.method=="OPTIONS") res.sendStatus(200);/*让options请求快速返回*/
  else  next();
});

// 后端api路由
app.use('/leave', Leave);
app.use('/user', User);
app.use('/work',Work);
// 监听端口
app.listen(3000);
console.log('success listen at : http://localhost:3000');