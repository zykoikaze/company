<template>
   <el-aside class="boyan-web-aside">
      <el-menu 
         :default-active="menu.defaultActive"
         background-color="#909399"
         text-color="#fff"
         active-text-color="#ffd04b"
         :default-openeds="menu.openeds"
         :unique-opened="true"
         :collapse-transition="false"
         :collapse="collapse">
         <!-- <el-menu-item index="0" class="icon-menu">
            <i class="el-icon-menu"></i>
         </el-menu-item> -->
         <el-submenu
            index="1" 
            class="boyan-web-menu">
            <template slot="title">
               <i class="el-icon-location"></i>
               <span slot="title">待定</span>
            </template>
            <el-submenu 
               index="1-1"  
               class="boyan-web-menu">
                  <template slot="title">选择日期</template>
                  <el-menu-item
                     class="boyan-web-menu"
                     v-for="(months,key,index) in leaveData"
                     :index="'1-1-'+(index+1)"
                     :key="index"
                     @click="handleMonthData(key,'1-1-'+(index+1),'/api/leave/get-month-data')">
                     {{key}}
                  </el-menu-item>
                  <!-- <el-submenu
                     class="boyan-web-menu"
                     v-for="(months,key,index) in leaveData"
                     :index="'1-1-'+(index+1)"
                     :key="index">
                     <template slot="title">{{key}}</template>
                     <el-menu-item
                        class="boyan-web-menu-item"
                        v-for="(days,key,idx) in months"
                        :key="idx"
                        :index="'1-1-'+(index+1)+'-'+(idx+1)"
                        @click="handleTimeData(key,'1-1-'+(index+1)+'-'+(idx+1),'/api/leave/getOneData')">
                        {{key}}
                     </el-menu-item>
                  </el-submenu> -->
            </el-submenu>

            <el-submenu  
               class="boyan-web-menu"
               index="1-2"
               disabled>
                  <template slot="title">选择人员</template>
                  <el-menu-item index="1-2-1"></el-menu-item>
            </el-submenu>
         </el-submenu>

         <el-submenu  
            class="boyan-web-menu"
            index="2">
            <template slot="title">
               <i class="el-icon-location"></i>
               <span slot="title">待定</span>
            </template>
            <el-menu-item-group>
               <template slot="title">分组一</template>
               <el-menu-item index="2-1">选项1</el-menu-item>
               <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
               <el-menu-item index="2-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="2-4">
               <template slot="title">选项4</template>
               <el-menu-item index="2-4-1">选项4-1</el-menu-item>
            </el-submenu>
         </el-submenu>
      </el-menu>
   </el-aside>
</template>
<script>
import { mapActions,mapState,mapMutations } from 'vuex'
import { saveSessionStore,getSessionStore,toObject } from '../util/util'
export default {
   name:'leave-aside',
   props:["menu","data","initData","loadDayData","changeState"],
   data(){
     return {
        collapse:false
      }
   },
   mounted(){
      // console.log(window.innerHeight)
   },
   computed:{
      leaveData(){         
         if(this.data.length>0){
            return this.data
         }else{
            return toObject(getSessionStore('data'))
         }
      }
   },
   methods:{ 
      //请求某天数据   
      handleTimeData(time,index,path){
         var vm=this;
         vm.tableData=[];
         vm.changeState({
            name:'leaveTableData',
            value:[]
         })
         vm.loadDayData({
            time:vm.momentTime(time),
            path:path
         })
         .then(function(){
            let tableData=vm.$store.state.leave.leaveTableData.length>0 ? JSON.stringify(vm.$store.state.leave.leaveTableData) : "[]";            
            saveSessionStore('saved','{"time":"'+time+'","openeds":"'+index+'","alldata":'+tableData+'}')
         }).catch((error)=>{
            vm.$message({
            message: '和后端失联~',
            type: 'warning',
            showClose: true,
            });
         })
      },
      handleMonthData(month,index,path){
         var vm=this;   
         vm.tableData=[];
         vm.changeState({
            name:'leaveTableData',
            value:[]
         })
         vm.loadDayData({
            time:vm.momentMonth(month),
            path:path
         })
         .then(function(){
            let tableData=vm.$store.state.leave.leaveTableData.length>0 ? JSON.stringify(vm.$store.state.leave.leaveTableData) : "[]";            
            saveSessionStore('saved','{"time":"'+month+'","openeds":"'+index+'","alldata":'+tableData+'}')
         }).catch((error)=>{          
            vm.$message({
               message: '和后端失联~',
               type: 'warning',
               showClose: true,
            });
         })
      },
      handleOpen(key, keyPath){
         this.collapse=!this.collapse;
      },
      momentTime(time){
         return moment(time).format('YYYY-MM-DD');
      },
      momentMonth(time){
         var year=moment(time).get('year'),
            month=moment(time).get('month')+1;
            month=month>9?month:'0'+month;
         return year+'-'+month;
      }
   }
}
</script>
