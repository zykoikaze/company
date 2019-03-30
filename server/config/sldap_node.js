var ldap = require("ldapjs");
var config = require("./ldap.json");
function setConfig(obj){
    for(var key in obj){
        config[key] = obj[key];
    }
}
function getUrl(){
    return ['ldap://', config.host || "localhost", ":" + (config.port || "389")].join("");
}
function check(username, password, callback){
    var client = ldap.createClient({
        url: getUrl()
    });
    if(config.commonDN && config.commonPW){
        client.bind(config.commonDN, config.commonPW, function(err){
            if(err) {callback && callback(err, "配置项有误，校验失败！"); return ;}
            client.search(config.baseDN, {
                filter:  '(mailNickname=' + username + ')',
                scope: 'sub'
            }, function(err, res){
                var isFind = false;
                if(err) {callback && callback(err); return ;}
                res.on('searchEntry', function(entry) {
                    if(entry && entry.object && entry.object["dn"]){
                        isFind = true;
                        client.bind(entry.object["dn"], password, function(err){
                            if(!err){
                                callback && callback(null, entry.object);
                            }
                            else{
                                callback && callback(err, "密码错误！");
                            }
                        });
                    }
                });
                res.on('end', function(result){
                    if(!isFind){
                        callback && callback(new Error("当前用户不存在！"), "当前用户不存在！");
                    }
                });
                res.on('error', function(err) {
                    callback && callback(err, "当前用户不存在！");
                });
            })
        });
    }
    else{
        callback && callback(new Error("Please config commonDN and commonPW"), "配置项有误，无法建立连接！");
    }
};
module.exports.setConfig = setConfig;
module.exports.check = check;