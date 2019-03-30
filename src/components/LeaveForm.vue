<template>
     <!-- 请假表单-->
    <el-dialog 
        :title="labelText.title"
        top="5vh"
        :visible.sync="LeaveFormAdd"
        :before-close="()=>{return handleClose('ruleForm')}">
        <el-form 
            label-width="80px"
            :model="form"
            :rules="rules"
            size="small" 
            ref="ruleForm">
         <el-form-item 
            :label="labelText.leavetype"
            prop="leave_type">
            <el-select 
               v-model="form.leave_type"
               placeholder="请选择请假类别">
               <el-option 
                     v-for="type in form.leave_type_list" 
                     :key="type.id" 
                     :label="type" 
                     :value="type" />                     
            </el-select>
         </el-form-item>
         <el-form-item 
            label="时间类型" 
            prop="time_type">
            <el-select 
               v-model="form.time_type"
               placeholder="请选择时间类型">
               <el-option 
                     v-for="time in form.leave_time_list" 
                     :key="time.id" 
                     :label="time" 
                     :value="time" />
            </el-select>
         </el-form-item>

         <el-form-item 
            label="开始时间" 
            prop="start_date">
         <el-date-picker 
            type="date" 
            placeholder="选择日期" 
            v-model="form.start_date"
            value-format="timestamp" />
         </el-form-item>

         <el-form-item 
            label="结束时间" 
            prop="end_date">
         <el-date-picker 
            type="date" 
            placeholder="选择日期" 
            v-model="form.end_date" 
            value-format="timestamp" />
         </el-form-item>

         <el-form-item 
               label="天数"  
               prop="count_days">
         <el-input-number  
               v-model="form.count_days" 
               :disabled="true" 
               :controls="false" />
         </el-form-item>

         <el-form-item 
               label="小时" 
               prop="count_hours">
         <el-input-number  
               v-model="form.count_hours" 
               :controls="false" />
         </el-form-item>

         <el-form-item 
               label="总时数"  
               prop="total_time">
         <el-input-number  
               v-model="form.total_time" 
               :disabled="true" 
               :controls="false" />
         </el-form-item>

         <el-form-item 
               :label="labelText.reason"
               prop="leave_reason">
               <el-input 
                  type="textarea"                  
                  v-model="form.leave_reason" />              
         </el-form-item>

      </el-form>
      <div 
         slot="footer" 
         class="dialog-footer">
         <el-button @click="handleClose('ruleForm')">取消</el-button>
         <el-button type="primary" @click="handleSave('ruleForm')">提交</el-button>
      </div>
   </el-dialog>
</template>
<script>
import LeaveFormData from '../assets/js/LeaveForm.js'
import { mapActions,mapState,mapMutations } from 'vuex'
import { getSessionStore , saveSessionStore, toObject} from '../util/util'
export default {
   name:"leave-form",
   props:['config','menu','initData','changeState','addPath'],
   data(){
      var formData=LeaveFormData(this,moment);            
      return {
         form:formData.form,
         rules:formData.rules,
      }
   },   
   computed:{
      ...mapState({
         'LeaveFormAdd':state=>state.leave.LeaveFormAdd,
      }),
      labelText(){
         return this.config.leave.app_form
      }
   },
    methods:{        
        //关闭新增表单
        handleClose(formname){
            this.changeState({
               name:'LeaveFormAdd',
               value:false
            })
            this.$refs[formname].resetFields();
        },
        //保存新增保单数据
        handleSave(formname){
            var vm=this;
            vm.$refs[formname].validate((valid)=>{
                if(valid){
                     let formData = new FormData();
                     const user=vm.$store.state.user;
                     vm.changeState({
                           name:'LeaveFormAdd',
                           value:false
                     })                    
                     formData.append("username", user.username);
                     formData.append("userid", user.userid); 
                     formData.append("createtime", vm.momentTime(new Date()));
                     formData.append("starttime",vm.momentTime(vm.form.start_date)); 
                     formData.append("endtime", vm.momentTime(vm.form.end_date)); 
                     formData.append("timetype", vm.form.time_type);
                     formData.append("countdays",vm.form.count_days);
                     formData.append("totaltime",vm.form.total_time);
                     formData.append("leavetype",vm.form.leave_type);
                     formData.append("counthours",vm.form.count_hours);
                     formData.append("reason",vm.form.leave_reason);
                     
                     axios.post(vm.addPath,formData)
                     .then((res)=>{
                           const data=res.data;
                           if(vm.type=='leave'){
                              saveSessionStore('saved',null);
                              vm.changeState({
                                 name:'menu',
                                 value:{
                                       'openeds':['1','1-1','1-1-1'],
                                       'defaultActive':'1-1-1'
                                 }
                              })
                           }
                           vm.initData()
                           if(data.code =='success'){
                              vm.$refs[formname].resetFields();                            
                           }else{
                              vm.$message({
                                 message: data.msg,
                                 type: 'warning',
                                 showClose: true ,
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
                    this.$message({
                        message: '所有的框框都是必填的哦~',
                        type: 'warning',
                        showClose: true,
                    });
                }
            })       
        }, 
        momentTime(time){
            return moment(time).format('YYYY-MM-DD');
        },
    }
}
</script>

