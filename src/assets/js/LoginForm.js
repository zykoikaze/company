module.exports=function(vm){    
    let form_data = {
        userID: '',
        password: '',
        checked: true
    };
    var validateUserID = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
    };
      var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      }
    };
    return {
      form: form_data,
      rules:{
        userID: [
          {required: true, message: '用户ID必填', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码必填', trigger: 'blur'}
        ],           
     },
  }
}