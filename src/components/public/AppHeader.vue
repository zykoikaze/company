<template>
    <el-header class="app-header boyan-web-title">
        <el-menu 
            class="el-menu-demo boyan-web-head"
            mode="horizontal"            
            menu-trigger="click"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            @select="handleSelect"
            :default-active="active"
            :router="true">
            <el-menu-item 
                index="1"
                route="/leave">请假信息</el-menu-item>
            <el-menu-item 
                index="2"
                route="/work">加班信息</el-menu-item>
            <el-submenu 
                index="3" 
                class="el-menu-demo boyan-web-user">              
              <template 
                slot="title">
                  <img 
                    :src="Head.userPic" 
                    class="boyan-web-head-pic"/> {{Head.userName}}
              </template>
              <el-menu-item 
                index="3-1" 
                @click="deleteSession()">退出</el-menu-item>    
            </el-submenu>
        </el-menu>
      </el-header>
</template>
<script>
import {getCookie} from '@/util/util'
export default {
    name:'app-header',
    data(){
        const HEAD_PIC='https://oa.sogou-inc.com/moa/sylla/mapi/img?s=1&w=29&h=29&id='  
        return {
           HEAD_PIC:HEAD_PIC,
           active:'1'
        }
    },
    mounted(){
        let path=this.$route.fullPath;
        if(path == '/work'){
            this.active='2'
        }else{
            this.active='1'
        }
    },
    computed:{
        Head(){
            let user=this.$store.state.user;
            if(!user || user == null){
                user=decodeURIComponent(getCookie('user'));
                user=JSON.parse(user);
            }
            return {
                userPic:this.HEAD_PIC+user.userid,
                userName:user.username
            }
        }
    },
    methods:{
        deleteSession(){
            const vm=this;
            axios.get('/api/user/delCookie')
            .then((res)=>{
                const data=res.data;                
                vm.$router.push({ path: '/login'})
            })
            .catch((err)=>{
                console.log('退出失败')
            })
        },
        handleSelect(key, keyPath){            
            this.active=key
        }    
    }
}
</script>
