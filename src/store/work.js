import { getCookie,saveSessionStore } from '@/util/util'
const WORK_SUCCESS='LEAVE_SUCCESS',
      WORK_FAILE='LEAVE_FAILE',
      WORK_TABLE_DATA='LEAVE_TABLE_DATA';
const work = {
  state: {
    WorkFormAdd: false,
    workTableData:[],
    end_time_isBlur:false
  },
  mutations: {
    [WORK_TABLE_DATA](state,action){    
      state.workTableData=action.workTableData      
    },
    changeState(state,action){
      state[action.name]=action.value
    }
  },
  actions: {
    loadWorkData ({ commit, state },param) {
      return new Promise(function(resolve, reject){
         axios.get('/api/work/get-work-data')
         .then((response)=>{
            let data=response.data.result;
            let tableData=[];
            data.forEach(function(item,index){                
              item.start_time=moment(item.start_time).format('YYYY-MM-DD HH:mm:ss')
              item.end_time=moment(item.end_time).format('YYYY-MM-DD HH:mm:ss')
              tableData.push(item)
            })            
            commit(WORK_TABLE_DATA,{
              workTableData:tableData
            })
            resolve()
            
         })
         .catch((error)=>{
            commit(WORK_FAILE, {
               error: error
            })
            // reject()
         })
      })
    },
  },
  getters: {

  }
}
export default work