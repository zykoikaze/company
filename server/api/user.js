const path = require('path')
const express = require('express');
const mysql = require('mysql');
const ldap = require('ldapjs');
var multer = require('multer');
const ldapconf = require('../config/server.json').ldap;
const mysqlconf = require('../config/server.json').mysql;
const router = express.Router();

const conn=mysql.createConnection(mysqlconf)
conn.connect();
var upload  = multer();
// 验证首次登陆的用户是否存在
router.post('/validate-user-id',upload.none(),validate);
router.get('/getSession',getSession)
router.get('/delCookie',delCookie)
function validate(req, res){   
    /**
     * get - req.query
     * post - req.body
     */
    var userid=req.body.userid,
        userPW=req.body.password,
        isSavePW=req.body.checked;
    
    // 绑定查询帐户
    if(~userid.indexOf('@') && userid.split('@')[1]!='sogou-inc.com'){
        res.json({
            code:'error',
            msg:'要用Sogou的邮箱登陆才可以哦！'
        })
    }
    userid=~userid.indexOf('@sogou-inc.com')?userid:userid+'@sogou-inc.com';
    var options = {
        filter: '(mail='+userid+')',
        scope: 'sub',     //查询范围
        timeLimit: 500    //查询超时
    }  
    // 创建客户端
    var client = ldap.createClient({
        url: getUrl(),
        reconnect: true
    });
    if(ldapconf.commonDN && ldapconf.commonPW){
        client.bind(ldapconf.commonDN, ldapconf.commonPW, function (err, cacti) {        
            if(err){        //配置项有误，校验失败！    
                res.json({
                    code: 'error',
                    msg: '第一步就错啦！'
                });            
            } 
            client.search(ldapconf.baseDN,options, function (err,result) {  
                var isFind = false;
                if(err){
                    res.json({
                        code: 'error',
                        msg: '第二步错啦！'
                    });     
                }                     
                result.on('searchEntry', function(entry) {                    
                    if(entry && entry.object && entry.object["dn"]){
                        isFind = true;                       
                        client.bind(entry.object["dn"], userPW, function(err,meg){                        
                            if(err){
                                res.json({
                                    code: 'error',
                                    msg: '密码错误！'
                                }); 
                            }else{     
                                const username= entry.object["sn"]+entry.object["givenName"],
                                    userid=entry.object["cn"];
                                if(!req.cookies.user){
                                    res.cookie("user",JSON.stringify({
                                        "userid":userid,
                                        "username":username
                                    }),{maxAge:1000 * 60 * 60 * 24 * 30});    
                                }  
                                req.session.user = {
                                    username:username,
                                    userid:userid,                               
                                    isSavePW:isSavePW,
                                }; 
                                // var sql = $sql.user.addUser;                               
                                res.json({
                                    code: 'success',
                                    msg: {
                                        username:username,
                                        userid:userid
                                    }
                                }); 
                            }                          
                        });
                    }
                });
                result.on('end', function(result){  
                    // client.unbind()
                    if(!isFind){
                        res.json({
                            code: 'error',
                            msg: '当前用户不存在！'
                        }); 
                    }
                });
                result.on('error', function(err) {
                    client.unbind()
                    res.json({
                        code: 'error',
                        msg: '当前用户不存在！'
                    }); 
                });
            });   
        });   
       
    }
}
function getSession(req,res){  
    if(req.session.user){
       res.json({
            code: 'success',
            msg: req.session.user
        }); 
    }else{
        res.json({
            code: 'error',
            msg: '用户还未登陆过'
        }); 
    }
}
function delCookie(req,res){
    req.session.destroy(function(err) {
        delete req.session;
        res.clearCookie('boyan');   
        res.clearCookie('user')         
        res.json({
            code: 'success',
            msg: '退出成功'
        }); 
    })
}
function getUrl(){
    return ['ldap://', ldapconf.host || "localhost", ":" + (ldapconf.port || "389")].join("");
}

module.exports = router;