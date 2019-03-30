<template>
  <el-container style="display:block;">
    <!-- 增删改查 -->
    <app-c-r-u-d
      :initData="loadWorkData"
      :changeState="changeState"
      :config="config"
      Addtype="work"
      deletePath="/api/work/delete-work-data"/>
    <!-- 加班表单 -->  
    <work-form
      :initData="loadWorkData"
      :changeState="changeState"
      :config="config"
      addPath="/api/work/add-work-data"/>
    <!-- 数据展示区域 -->
    <work-show-data 
      :workTableData="workTableData"
      :initData="loadWorkData"/>
  </el-container>
</template>

<script>
import { mapActions,mapState,mapMutations } from 'vuex'
import { saveSessionStore,getSessionStore,toObject } from '../util/util'
import config from '../config/menu'
import AppCRUD from './public/AppCRUD'
import WorkForm from './WorkForm'
import WorkShowData from './WorkShowData'
export default {
  name: 'work',
  components:{AppCRUD,WorkForm,WorkShowData},
  data(){
    return {     
      LeaveBigImageSync:false,
      LeaveBigImageSrc:'',
      config:config,
    }
  },
  mounted(){
    this.loadWorkData() 
  },
  computed:{
    ...mapState({      
      'workTableData':state=>state.work.workTableData
    }),
  },
  methods:{
    ...mapMutations([
      'changeState'
    ]),
    ...mapActions([
      'loadWorkData'
    ]),    
  }
}
</script>