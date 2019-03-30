<template>
  <div class="hello">
    <el-table :data="tableData" border>  
      <el-table-column type="selection" width="55"></el-table-column>  
      <el-table-column  label="附件">
        <template slot-scope="scope">                                
          <el-upload 
            class="upload-demo"
            action="https://www.douban.com/photos/photo/2518243508"      
            :file-list="uploadFileList(scope.row)">
            <el-button 
              size="small" 
              type="primary">点击上传</el-button>
            <div 
              slot="tip" 
              class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </template>                              
      </el-table-column>
    </el-table>
     
  </div>
</template>

<script>

export default {
  name: "hello-word",
  data() {    
    return {   
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],  
      tableData:[]   
    };
  },
  created(){
    this.initData();
  },
   methods: {       
      initData(){       
        var vm=this;  
        this.$http.jsonp('https://api.douban.com/v2/book/search?q=斗破苍穹').then((res)=>{
          
          vm.tableData=res.body.books; 
        },(res)=>{

        })
      },  
      uploadFileList(row){ 
        var filelist=[];
        if(row.image){
           var name=row.title,
            url=row.image;
          filelist=[{name:name,url:url}]
        }
        return filelist;        
      }  
    },
    
};
</script>
