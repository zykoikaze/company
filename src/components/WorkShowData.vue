<template>
   <div>
      <el-table
      :data="workTableData"
      border
      style="width: 100%;"      
      max-height="650">
      <el-table-column
         fixed="right"
         label="操作"
         width="60">
         <template slot-scope="scope">
            <!-- <el-button
               @click.native.prevent="deleteRow(scope.$index, scope.row)"
               type="text"
               size="small">
               新增
            </el-button> -->
            <el-button
               @click.native.prevent="deleteRow(scope.$index, scope.row)"
               type="text"
               size="small">
               移除
            </el-button>
         </template>
      </el-table-column>      
      <el-table-column
        prop="user_name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="start_time"
        label="开始日期">
      </el-table-column>
      <el-table-column
        prop="end_time"
        label="结束日期">
      </el-table-column>
      <!-- <el-table-column
        prop="work_days"
        label="加班天数">
      </el-table-column> -->
      <el-table-column
        prop="work_hours"
        label="工作时长">
      </el-table-column>
      <el-table-column
        prop="over_time"
        label="加班时长">
      </el-table-column>
      <el-table-column
        prop="reason_for_work"
        label="加班原因">
      </el-table-column>
      <el-table-column
        prop="enclosure"
        label="附件">
        <template slot-scope="scope">
            <el-upload 
               class="upload-demo boyan-web-upload"
               multiple    
               drag     
               action="/api/work/upload-work-image"    
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
         :visible.sync="WorkBigImageSync">
         <img :src="WorkBigImageSrc"/>
      </el-dialog>
   </div>
</template>
<script>
import { saveSessionStore,getSessionStore,toObject } from '../util/util'
export default {
   name:'work-show-data',
   props:["initData","workTableData"],
   data(){
      return {
         WorkBigImageSrc:'',
         WorkBigImageSync:false,
         HOST_PATH:'http://'+window.location.hostname+':3000'
      }; 
   },  
   methods:{
      //上传图片
      uploadImage(item,$index,$row){
        var vm=this;
        let formData = new FormData(); 
        formData.append('enclosure', item.file)
        formData.append('mysql_id', $row.id)
        formData.append('userid', $row.user_id)       
        axios.post('/api/work/upload-work-image',formData)
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
         this.WorkBigImageSync=true;
         var src=this.HOST_PATH+'/work_uploads/'+file.filename;
         this.WorkBigImageSrc=src;
      },
      //删除图片
      uploadRemove(file,$index,$row){
         let mysql_id=$row.id,
            filename=file.filename;
         var param={mysql_id:mysql_id,filename:filename};
         axios.post('/api/work/delete-work-image',param)
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
      deleteRow($index,$row){
         var vm=this;
         axios.post('/api/work/delete-one-data',{'id':$row.id})
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
