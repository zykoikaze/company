<template>
   <el-main class="boyan-web-main">
      <el-table 
         class="boyan-web-table"
         :data="leaveTableData"
         max-height="650"
         border 
         @select="getSelectCloumn">
         <el-table-column
            fixed="left"
            label="操作"
            width="55">
            <template slot-scope="scope">
            <el-button
               @click.native.prevent="deleteRow(scope.$index, scope.row)"
               type="text"
               size="small">
               移除
            </el-button>
            </template>
         </el-table-column>
         <!-- <el-table-column 
            type="selection"
            width="55"></el-table-column> -->
         <el-table-column 
            prop="user_name" 
            label="姓名" 
            width='90'></el-table-column>                          
         <el-table-column 
            prop="start_time" 
            label="开始日期" 
            width="110"></el-table-column>
         <el-table-column 
            prop="end_time" 
            label="结束日期" 
            width="110"></el-table-column>
         <el-table-column 
            prop="leave_type" 
            label="请假类型" 
            width="90"></el-table-column>
         <el-table-column 
            prop="time_type" 
            label="时间类型" 
            width="90"></el-table-column>
         <el-table-column 
            prop="count_days" 
            label="请假天数" 
            width="90"></el-table-column>
         <el-table-column
            prop="total_time" 
            label="总时长" 
            width="90"></el-table-column>
         <el-table-column 
            prop="reason_for_leave" 
            label="请假说明" 
            width="100"></el-table-column>
         <el-table-column  
            label="附件"  
            min-width="160">
            <template slot-scope="scope">
            <el-upload 
               class="upload-demo boyan-web-upload"
               multiple    
               drag     
               action="/api/leave/uploadOneData"    
               :file-list="uploadFileList(scope.row)"
               :headers="{'Content-Type':'application/x-www-form-urlencoded'}"
               :http-request="(item)=>{return uploadImage(item,scope.$index,scope.row)}"                            
               :on-preview="(file)=>{return uploadPreview(file,scope.$index,scope.row)}"
               :on-remove="(file)=>{return uploadRemove(file,scope.$index,scope.row)}">
               <el-button 
                  size="small" 
                  type="primary">拖到此处 / 点击上传</el-button> 
            </el-upload>                               
            </template>
         </el-table-column>         
      </el-table>

      <!-- 大图 -->
      <el-dialog 
         class="boyan-web-img-dialog"
         title="展示大图"
         top="5vh"
         :visible.sync="LeaveBigImageSync">
         <img :src="LeaveBigImageSrc"/>
      </el-dialog>

   </el-main>
</template>

<script>
import { mapState } from 'vuex'
import { getSessionStore , saveSessionStore, toObject} from '../util/util'
export default {
  name: 'leave-show-data',
  props:["initData","leaveTableData"],
  components:{},
  data(){
      return {
         LeaveBigImageSrc:'',
         LeaveBigImageSync:false,
         HOST_PATH:'http://'+window.location.hostname+':3000'
      }
  },
   computed:{
     
   },
   methods:{     
     //上传图片
      uploadImage(item,$index,$row){
        var vm=this;
        let formData = new FormData(); 
        formData.append('enclosure', item.file)
        formData.append('mysql_id', $row.id)
        formData.append('userid', $row.user_id)       
        axios.post('/api/leave/uploadOneData',formData)
        .then((res)=>{ 
          const data=res.data;
          if(data.code =='success'){
            vm.initData()
          }else{
            vm.$message({
              message: data.msg,
              type: 'warning',
              showClose: true,
            })
          }            
        }).catch((res)=>{
            vm.$message({
              message:'和后端失联',
              type: 'warning',
              showClose: true,
            })
        })
      },
      //查看大图
      uploadPreview(file,$index,$row){         
         this.LeaveBigImageSync=true;
         var src=this.HOST_PATH+'/uploads/'+file.filename;
         this.LeaveBigImageSrc=src;
      },
      //删除图片
      uploadRemove(file,$index,$row){
         let mysql_id=$row.id,
            filename=file.filename;
         var param={mysql_id:mysql_id,filename:filename};
         axios.post('/api/leave/deleteImage',param)
         .then(function(res){
            if(res.data.code == 'success'){               
               vm.initData()
            }
         }).catch(function(){

         })
      }, 
      uploadFileList(row){       
        var filelist=[];
        if(row.enclosure){
          filelist=toObject(row.enclosure)
        }
        return filelist;        
      },      
      //获取选中的所有行
      getSelectCloumn(selection, row){
         if(selection.length>0){
            saveSessionStore('selectCloumnAll',JSON.stringify(selection))
         }           
      },
      deleteRow($index,$row){
         var vm=this;
         axios.post('/api/leave/deleteData',{'id':$row.id})
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
      }
  }
}
</script>