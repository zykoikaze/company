<template>
  <el-container class="container">
    <!-- 左侧导航栏 -->
    <leave-aside
      :menu="menu"
      :data="leaveData"
      :initData="initData"
      :loadDayData="loadDayData"
      :changeState="changeState" />
    <el-container class="boyan-web-databox">
      <el-tab-pane label="请假信息" style="display:block;width:100%">
          <!-- 增删改查 -->
          <app-c-r-u-d
            :initData="initData"
            :changeState="changeState"            
            :config="config"
            Addtype="leave"
            deletePath="/api/work/deleteData"/>
          <!-- 请假表单 -->
          <leave-form
            :menu="menu"
            :initData="initData"
            :changeState="changeState"
            :config="config"
            addPath="/api/leave/addOneData"/>
          <!-- 数据展示区域 -->
          <leave-show-data            
            :initData="initData"
            :leaveTableData="leaveTableData"/>
      </el-tab-pane>
    </el-container>
  </el-container>
</template>

<script>
import { mapActions,mapState,mapMutations } from 'vuex'
import { saveSessionStore,getSessionStore,toObject } from '../util/util'
import config from '../config/menu'

import AppCRUD from './public/AppCRUD'
import LeaveAside from './LeaveAside'
import LeaveForm from './LeaveForm'
import LeaveShowData from './LeaveShowData'

export default {
  name: 'leave',
  components:{ AppCRUD,LeaveForm,LeaveAside,LeaveShowData },
  data(){
    return {
      config:config
    }
  },
  mounted () {
    this.initData()
  },
  computed:{
    ...mapState({
      'menu':state=>state.leave.menu,
      'leaveData':state=>state.leave.data,
      'leaveTableData':state=>state.leave.leaveTableData
    }),
  },  
  methods:{
    ...mapActions([
      'loadLeaveData','loadDayData'
    ]),
    ...mapMutations([
      'changeState',
    ]),    
    //初始化数据
    initData(){
      let vm=this;
      let cursave=getSessionStore('saved');
      if(cursave && cursave!='null'){
        let daydata=toObject(cursave);
        let time=daydata.time;
        vm.loadDayData({
          time:vm.momentMonth(time),
          path:'/api/leave/get-month-data'
        })
        vm.changeState({
          name:'menu',
          value:{
            'openeds':vm.splitOpends(daydata.openeds),
            'defaultActive':daydata.openeds
          }
        })
      }else{
        vm.loadLeaveData({isFirst:0})
        .then(function(){
        
        }).catch((res)=>{
          vm.$message({
            message: '获取数据失败，请刷新页面~',
            type: 'warning',
            showClose: true ,
          });
        })
      }
    },
    //处理请求回来的时间格式
    splitTime(time){
      var month=moment(time).get('month')+1,
        date=moment(time).get('date');
        month=month>9?month:'0'+month;
        date=date>9?date:'0'+date;
        return month+'-'+date;
    },
    //获取导航默认展开index
    splitOpends(str){
      let con='',openeds=[];
      str.split('-').forEach(function(o,i){
        if(i>0){con+='-'}
        con+=o;
        openeds.push(con)
      }) 
      return openeds;
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
