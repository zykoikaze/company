module.exports = function (vm, moment) {
  var now = moment().format('YYYY-MM-DD');
  var zero = moment(now).format('YYYY-MM-DD HH:mm:ss');
  var today = moment(now).toDate().getTime();
  var end_time_isFirst=true;
  var form_data = {
    user_name: '',
    user_id: '',
    start_date: moment(now),
    end_date: moment(now),
    start_time: moment(now+' 09:00:00'),
    end_time: moment(now+' 20:00:00'),
    work_days: 1,
    work_hours: 11,
    over_time: 2,
    work_reason: '',
  }
  var validateStartdate = (rule, value, callback) => {
    var start_date = value,
        end_date = form_data.end_date,
        start_time=form_data.start_time,
        end_time=form_data.end_time;
    if (!value) {
      return callback(new Error('开始日期不能为空哦~'))
    }
    if (format(start_date) != format(end_date)) {
      return callback(new Error('记得更改结束日期哦~'));
    }
    if (format(start_date) == format(end_date)) {
      var weekday=moment(value).weekday();
      var desc = moment(end_date - start_date) / 86400000
          form_data.work_days = desc + 1;
      if(weekday !=0 && weekday != 6){
        var start=getmillisecond(start_time),
            end=getmillisecond(end_time);
        if(moment(end_time).hour() < 9 && !vm.$store.state.work.end_time_isBlur){
          end=moment(end_time+24*60*60*1000);
        }
        form_data.work_hours = toFixed2((end-start)/3600000);
        form_data.over_time = toFixed2((end-start)/3600000-9);
      }else{
        form_data.over_time = 11;
      }     
      callback();
    }
  };
  var validateEnddate = (rule, value, callback) => {
    var end_date = value,
        start_date = form_data.start_date,
        start_time=form_data.start_time,
        end_time=form_data.end_time;
    if (!value) {
      return callback(new Error('结束日期不能为空哦~'))
    }

    if (format(start_date) != format(end_date)) {
      return callback(new Error('记得更改开始日期哦~'));
    }
    if (format(start_date)  == format(end_date)) {
      var weekday=moment(value).weekday();
      var desc = moment(end_date - start_date) / 86400000
          form_data.work_days = desc + 1;
      if(weekday !=0 && weekday != 6){
        var start=getmillisecond(start_time),
            end=getmillisecond(end_time);
        if(moment(end_time).hour() < 9 && !vm.$store.state.work.end_time_isBlur){
          end=moment(end_time+24*60*60*1000);
        }
        form_data.work_hours = toFixed2((end-start)/3600000);
        form_data.over_time = toFixed2((end-start)/3600000-9);
      }else{
        form_data.over_time = 11;
      }
      callback();
    }
  };
  var validateStarttime = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('开始时间不能为空哦~'))
    }
    var weekday=moment(form_data.start_date).weekday(),
        cur_value=form_data.end_time;
    if(moment(cur_value).hour() < 9 && !vm.$store.state.work.end_time_isBlur){
      cur_value=moment(form_data.end_time+24*60*60*1000);     
    }
 
    if(weekday !=0 && weekday != 6){
      form_data.work_hours=toFixed2((cur_value-value)/3600000);
      form_data.over_time = toFixed2((cur_value-value)/3600000-9);
    }else{
      form_data.work_hours=toFixed2((cur_value-value)/3600000); 
      form_data.over_time = toFixed2((cur_value-value)/3600000);
    }    
    callback();
  };
  var validateEndtime = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('结束时间不能为空哦~'))
    }    
    var weekday=moment(form_data.end_date).weekday(),
        cur_value=value;
    if(moment(value).hour() < 9){
      cur_value=value+24*60*60*1000;
      if(vm.$store.state.work.end_time_isBlur){
        form_data.end_time=moment(cur_value)
      }
    }
    
    if(weekday !=0 && weekday != 6){      
      form_data.work_hours= toFixed2((cur_value- form_data.start_time)/3600000);
      form_data.over_time = toFixed2((cur_value- form_data.start_time)/3600000-9);
    }else{
      form_data.work_hours= toFixed2((cur_value- form_data.start_time)/3600000);
      form_data.over_time = toFixed2((cur_value- form_data.start_time)/3600000);
    }     
    callback();
  };

  return {
    form: form_data,
    rules: {
      start_date: [
        { required: true, validator: validateStartdate, trigger: 'blur' },
      ],
      end_date: [
        { required: true, validator: validateEnddate, trigger: 'blur' },
      ],
      start_time: [
        { required: true, validator: validateStarttime, trigger: 'blur' },
      ],
      end_time: [
        { required: true, validator: validateEndtime, trigger: 'blur' },
      ],
      work_hours: [
        { required: true, message:'工作时长不能为空' },
      ],
      work_reason: [
        { required: true, message: '加班说明', trigger: 'blur' },
      ],
    },
  }
  function getmillisecond(value){
    if(isNaN(Number(value))){
      value=moment(value).toDate().getTime();
    }else{
      value=Number(value);
    }
    var hh=moment(value).hour(),
        mm=moment(value).minute(),
        ss=moment(value).second();
    return hh*3600000+mm*60000+ss*1000;
  }
  function getHour(value){
    return Math.floor(value/3600000)
  }
  function getMinute(value){
    return Math.floor(value%3600000/60000)
  }
  function format(value){
    return moment(value).format('YYYY-MM-DD')
  }
  function toFixed2(value){
    value=value.toString()
    if(value.indexOf('.')>-1){
      return Number(value.substr(0,value.indexOf('.')+3))
    }else{
      return Number(value)
    }
  }
}
