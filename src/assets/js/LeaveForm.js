module.exports=function(vm,moment){
  let now = moment().format('YYYY-MM-DD');
  let zero = moment(now).format('YYYY-MM-DD HH:mm:ss');
  let today = moment(now).toDate().getTime(); 
  let leave_time_list = ['全天', '上午', '下午','小时'],
      leave_type_list = ['年假', '事假', '病假', '婚假','调休', '哺乳假', '项目假','旷工'];
  let form_data = {
    user_name: '',
    user_id: '',
    start_date: today,
    end_date: today,
    count_days: 1,
    count_hours: 8,
    total_time: 8,
    leave_type:'',
    time_type:'全天',
    leave_reason: '', 
    leave_type_list:leave_type_list,
    leave_time_list:leave_time_list
  }
  var validateLeavetype = (rule, value, callback)=>{
    if(!value){
      return callback(new Error('请假类型不能为空~'))
    }
    form_data.leave_time_list=leave_time_list;
    form_data.total_time = form_data.count_days * form_data.count_hours;
    callback();
  }
  var validateTimetype = (rule, value, callback) => {
    form_data.total_time = form_data.count_days * form_data.count_hours;
    callback();
  };
  var validateCounthours = (rule, value, callback)=>{
    if (!value || value == 0) {
      return callback(new Error('小时不能为空~'))
    }  
    form_data.total_time = form_data.count_days * value;
    callback();
  }
  var validateStarttime = (rule, value, callback) => {
    let start=value,
      end = form_data.end_date;
    if(!value){
      return callback(new Error('开始时间不能为空哦~'))
    }
    if (end && start > end){
      return callback(new Error('记得更改结束时间哦~'));
    }
    if(start && end){
      let desc = moment(end - start) / 86400000
      form_data.count_days = desc + 1;
      form_data.total_time = form_data.count_days * form_data.count_hours;      
    }
    callback();
  };
  var validateEndtime = (rule, value, callback) => {
    let start = form_data.start_date,
        end=value;
    if(!value){
      return callback(new Error('结束时间不能为空哦~'))
    }
    if(value<start || !start){
      return callback(new Error('还未开始，不能结束哦~'))
    }
    if (start && end) {    
      let desc = moment(end - start) / 86400000
      form_data.count_days = desc+1;
      vm.form.total_time = form_data.count_days * form_data.count_hours;      
    }
    callback();
  };
  return {
    form: form_data,
    rules:{
      leave_type:[
        { required: true, validator: validateLeavetype, trigger: 'change' },
      ],
      time_type:[
        { required: true, validator: validateTimetype,  trigger: 'change' },
      ],
      start_date:[
        { required: true, validator: validateStarttime, trigger: 'change' },
      ],
      end_date:[
        { required: true, validator: validateEndtime, trigger: 'change' },
      ],    
      count_hours:[
        { required: true, validator: validateCounthours, trigger: 'blur' },
      ],      
      leave_reason:[
        { required: true, message: '请假说明', trigger: 'blur' },
      ],
    },
  }
 }