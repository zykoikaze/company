import { getCookie,saveSessionStore } from '@/util/util'
const LEAVE_SUCCESS='LEAVE_SUCCESS',
      LEAVE_FAILE='LEAVE_FAILE',
      LEAVE_TABLE_DATA='LEAVE_TABLE_DATA';
const leave = {
   state: {
      update:true,
      LeaveFormAdd:false,
      data:[],      
      leaveTableData:[],
      menu:{
         openeds:['1','1-1','1-1-1'],
         defaultActive:'1-1-1',
      }
   },
   mutations:{     
      [LEAVE_SUCCESS](state,action){
         state.data = action.data
         saveSessionStore('data',JSON.stringify(action.data))
      },
      [LEAVE_FAILE](state,action){
         state.error = action.error
      },
      [LEAVE_TABLE_DATA](state,action){
         state.leaveTableData=action.leaveTableData
      },
      changeState(state,action){
         state[action.name]=action.value
      }
   },
   actions: {
      loadLeaveData ({ commit, state },param) {
         return new Promise(function(resolve, reject){            
            axios.get('/api/leave/getData')
            .then((response)=>{
               let data=response.data;
               let getData={}, tableData={};
               let flag=true;              
               data.forEach(function(item,index){
                  // var year=moment(item['create_time']).get('year'),
                  //    month=moment(item['create_time']).get('month')+1;
                  //    month=month>9?month:'0'+month;
                  var year=moment(item['start_time']).get('year'),
                     month=moment(item['start_time']).get('month')+1;
                     month=month>9?month:'0'+month;
                  var time=year+'-'+month;
                  if(!getData[time]){
                     getData[time]={};
                  }
                  item['create_time']=momentTime(item['create_time']);
                  item['start_time']=momentTime(item['start_time']);
                  item['end_time']=momentTime(item['end_time']);
                  // if(!getData[time][item['create_time']]){
                  //    getData[time][item['create_time']]=[]
                  // }                  
                  // getData[time][item['create_time']].push(item);
                  // if(tableData.length<1 && param.isFirst == 0){
                  //    tableData=getData[time][item['create_time']];
                  // }
                  if(!getData[time][item['start_time']]){
                     getData[time][item['start_time']]=[];
                  }
                  getData[time][item['start_time']].push(item);

                  if(flag && !tableData[time]){
                     flag=false;
                     tableData[time]=true;
                     tableData['data']=[]
                  }
                  if(param.isFirst == 0 && tableData[time] != undefined){
                     tableData['data'].push(item)
                  }
               })              
               commit(LEAVE_SUCCESS, {
                  data: getData
               })
               if(param.isFirst == 0){
                  commit(LEAVE_TABLE_DATA,{
                     leaveTableData:tableData['data']
                  })
               }
               resolve()
               
            })
            .catch((error)=>{
               commit(LEAVE_FAILE, {
                  error: error
               })
               // reject()
            })
         })
      },
      loadDayData({commit, state},param){
         return new Promise(function(resolve, reject){
            axios.post(param.path,{
               'startTime':param.time             
            })
            .then((response)=>{
               let tableData=[];
               response.data.forEach(function(item,index){
                  item['create_time']=momentTime(item['create_time']);
                  item['start_time']=momentTime(item['start_time'])
                  item['end_time']=momentTime(item['end_time'])               
                  tableData.push(item)
               })
               commit(LEAVE_TABLE_DATA,{
                  leaveTableData:tableData
               })
               resolve()
            })
            .catch((error)=>{
               commit(LEAVE_TABLE_DATA,{
                  leaveTableData:[]
               })
               // reject()
            })
         })
      }
   },
   getters: {
      leaveGetter(state){
         return state.data
      }
   }
 }
 export default leave

 function momentTime(time){
   return moment(time).format('YYYY-MM-DD');    
}