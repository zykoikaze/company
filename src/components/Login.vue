<template>
   <div class="boyan-web-body login">
      <div class="logo">
          <a href="javascript:;">
              <img src="../assets/images/logo.png" alt="">
          </a>
      </div>
      <div class="content">      
          <h3 class="form-title">欢迎登陆</h3>
          <el-form 
            :model="loginForm" 
            status-icon 
            :rules="loginRules" 
            ref="loginForm" 
            label-width="80px" 
            class="demo-ruleForm login-form">
            <el-form-item 
              label="用户ID" 
              prop="userID">
              <el-input 
                type="text" 
                v-model="loginForm.userID" 
                autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item 
              label="密码" 
              prop="password">
              <el-input 
                type="password" 
                v-model="loginForm.password" 
                autocomplete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="" prop="checked">
               <el-checkbox v-model="loginForm.checked">记住密码</el-checkbox>
            </el-form-item> -->
            <el-form-item class="boyan-web-login">
              <el-button 
                type="primary" 
                @click ="validateUser('loginForm')">提交</el-button>              
            </el-form-item>
         </el-form>
      </div>
   </div>
</template>

<script>
import LoginForm from '../assets/js/LoginForm.js'
export default {
  name: 'login',
  components: {},
  data() { 
      return {
        loginForm:LoginForm().form,
        loginRules: LoginForm().rules,  
      };     
    }, 
    methods:{
      //提交表单
      validateUser(formname) {
        var vm = this;
        this.$refs[formname].validate((valid)=>{
          if(valid){
            let formData = new FormData();
            formData.append('userid', vm.loginForm.userID);
            formData.append('password', vm.loginForm.password);
            formData.append('checked', vm.loginForm.checked);
            axios.post('/api/user/validate-user-id',formData)
            .then((res)=>{
              const data=res.data;          
              if(data.code!='success'){                
                vm.$message({
                  message: data.msg,
                  type: 'warning',
                  showClose: true,
                });
              }else{
                vm.$router.push({ path: '/'});
                vm.$store.state.user=data.msg;
              }
            }).catch((err)=>{
              vm.$message({
                message: '和后端失联',
                type: 'warning',
                showClose: true,
              });
            })
          }else{
             this.$message({
                message: '所有的框框都是必填的哦~',
                type: 'warning',
                showClose: true,
              });
          }
        })       
      },
    }
}
</script>
