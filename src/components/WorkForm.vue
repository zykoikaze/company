<template>
     <!-- 请假表单-->
    <el-dialog 
        :title="labelText.title"
        top="5vh"
        :visible.sync="WorkFormAdd"
        :before-close="()=>{return handleClose('workForm')}">
        <el-form 
            label-width="80px"
            :model="form"
            :rules="rules"
            size="small" 
            ref="workForm">
            <el-form-item 
                label="开始日期"
                required>
                <el-row>                    
                    <el-col :span="11">
                        <el-form-item
                            prop="start_date">
                            <el-date-picker 
                            type="date" 
                            placeholder="选择日期" 
                            v-model="form.start_date"
                            value-format="timestamp" />
                        </el-form-item>
                    </el-col>
                    <el-col  :span="11">
                        <el-form-item 
                            prop="start_time">
                            <el-time-picker
                                placeholder="选择时间" 
                                arrow-control
                                v-model="form.start_time"
                                value-format="timestamp"/>
                        </el-form-item> 
                    </el-col>
                    
                </el-row>
            </el-form-item>
          
            <el-form-item 
                label="结束日期"
                required>
                <el-row>
                    <el-col :span="11">
                        <el-form-item
                            prop="end_date">
                            <el-date-picker 
                                type="date" 
                                placeholder="选择日期" 
                                v-model="form.end_date"
                                value-format="timestamp" />
                        </el-form-item>      
                    </el-col>
                    <el-col :span="11">
                        <el-form-item
                            prop="end_time">
                            <el-time-picker
                                placeholder="选择时间"
                                arrow-control
                                v-model="form.end_time"
                                value-format="timestamp" />
                        </el-form-item>     
                    </el-col>                    
                </el-row>         
            </el-form-item>            
            <!-- <el-form-item 
                label="天数"  
                prop="work_days">
                <el-input-number  
                    v-model="form.work_days" 
                    :disabled="true" 
                    :controls="false" />
            </el-form-item> -->

            <el-form-item 
                label="工作时长"
                prop="work_hours">
                <el-input-number  
                    v-model="form.work_hours"
                    :controls="false" />
            </el-form-item>

            <el-form-item 
                label="加班时长"
                prop="over_time">
                <el-input-number  
                    v-model="form.over_time"
                    :disabled="true" 
                    :controls="false" />
            </el-form-item>

            <el-form-item 
                :label="labelText.reason"
                prop="work_reason">
                <el-input 
                    type="textarea"                   
                    v-model="form.work_reason" />
            </el-form-item>
        </el-form>
        <div 
            slot="footer" 
            class="dialog-footer">
            <el-button @click="handleClose('workForm')">取消</el-button>
            <el-button type="primary" @click="handleSave('workForm')">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
import WorkFormData from '../assets/js/WorkForm.js'
import { mapActions,mapState,mapMutations } from 'vuex'
import { getSessionStore , saveSessionStore, toObject} from '../util/util'
export default {
    name:"work-form",
    props:['config','initData','changeState','addPath'],
    data(){
        var formData=WorkFormData(this,moment);       
        return {
            form:formData.form,
            rules:formData.rules,
        }
    },   
    computed:{
        ...mapState({
            'WorkFormAdd':state=>state.work.WorkFormAdd,
        }),
        labelText(){
            return this.config.work.app_form
        }
    },
    methods:{        
        //关闭新增表单
        handleClose(formname){
            this.changeState({
                name:'WorkFormAdd',
                value:false
            })
            this.$refs[formname].resetFields();
        },
        //保存新增保单数据
        handleSave(formname){
            var vm=this;
            vm.changeState({
                name:'end_time_isBlur',
                value:true
            })
            vm.$refs[formname].validate((valid)=>{
                if(valid){
                    let formData = new FormData();
                    const user=vm.$store.state.user;
                    vm.changeState({
                        name:'WorkFormAdd',
                        value:false
                    })
                    formData.append("username", user.username);
                    formData.append("userid", user.userid);
                    formData.append("createtime", new Date().getTime());
                    formData.append("startdate",vm.form.start_date);
                    formData.append("enddate", vm.form.end_date);
                    formData.append("starttime",vm.form.start_time);
                    formData.append("endtime", vm.form.end_time);
                    
                    formData.append("workdays",vm.form.work_days);
                    formData.append("workhours",vm.form.work_hours);
                    formData.append("overtime",vm.form.over_time);
                    formData.append("workreason",vm.form.work_reason);                    
                    axios.post(vm.addPath,formData)
                    .then((res)=>{
                        var data=res.data;
                        if(data.code =='success'){
                            vm.initData()
                        }else{
                            vm.$message({
                                message: '新增数据失败~',
                                type: 'warning',
                                showClose: true,
                            });
                        }
                    })
                    .catch((err)=>{
                        vm.$message({
                            message: '和后端失联~',
                            type: 'warning',
                            showClose: true,
                        });
                    })
                }else{
                    vm.$message({
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

