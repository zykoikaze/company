//获取cookie、
export function getCookie(name) {
    var cookie=document.cookie;
    if(!cookie) return null;
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return (arr[2]);
    else
      return null;
  }
  
  //设置cookie,增加到vue实例方便全局调用
  export function setCookie (c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
  };
  
  //删除cookie
  export function delCookie (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
     document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  };

  //VUEX-刷新页面后数据丢失
  //决定获取数据后存储到本地
  export function saveLocalStore(l_name,value){
    window.localStorage.setItem(l_name,value)
  }
  export function saveSessionStore(s_name,value){
    window.sessionStorage.setItem(s_name,value)
  }
  export function getLocalStore(l_name){
    return window.localStorage.getItem(l_name)
  }
  export function getSessionStore(s_name){
    return window.sessionStorage.getItem(s_name)
  }
  //字符串 转为 对象
  export function toObject(string){
    return (new Function("return "+string))();
  }
  //处理日期时间
