<template>
  <el-header 
    class="main-header boyan-web-main-title"
    height="40px">
    <el-button
        icon="el-icon-circle-plus-outline"
        size="mini"
        round 
        @click="addSelectCloumn()" >新增</el-button>
    <el-button 
        icon="el-icon-delete" 
        size="mini" 
        round
        disabled
        @click="deleteSelectCloumn()">删除</el-button>
    <el-button
        icon="el-icon-edit"
        size="mini"
        round
        disabled>编辑</el-button>
  </el-header>
</template>

<script>
import { getSessionStore , saveSessionStore, toObject} from '../../util/util'

export default {
  name: 'leave-crud',
  components:{},
  props:['Addtype','initData','changeState','deletePath'],
  methods:{    
    //新增1行数据，dialog显示
    addSelectCloumn(){      
      if(this.Addtype=='leave'){
        this.changeState({
          name:'LeaveFormAdd',
          value:true
        })
      }else{       
        this.changeState({
          name:'WorkFormAdd',
          value:true
        })
      }      
    },
    //删除某行数据   
    deleteSelectCloumn(){
      var vm=this;
      var selectCloumnAll=getSessionStore('selectCloumnAll');
      if(selectCloumnAll){
        var allID=[];
        selectCloumnAll=toObject(selectCloumnAll);
        selectCloumnAll.forEach(function(row){
          allID.push(row.id)
        })
        axios.post(vm.deletePath,{'allID':allID})
        .then((res)=>{
            if(res.data.code=='success'){              
              vm.initData()
              vm.$message({
                message: '恭喜，删除数据成功啦！',
                type: 'success',
                showClose: true,
              });            
            }
          }).catch((res)=>{
            vm.$message({
              message: '和后端失联~',
              type: 'warning',
              showClose: true,
            });
          })
      }else{
          vm.$message({
            message: '嘿，哥们！记得选要删除的数据。',
            type: 'warning',
            showClose: true,
          });
      }
    },
  }
}
</script>