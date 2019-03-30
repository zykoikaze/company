const path = require('path')

const express = require('express');
const mysql = require('mysql');
const multer = require("multer");
const mime = require("mime-types");
const moment=require("moment");
const config = require('../config/server.json');
const $sql = require('../config/sqlmap.json');

const router = express.Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  	cb(null, path.resolve(__dirname, '../../public/work_uploads'))
	},
	filename: function (req, file, cb) {
		var fileformat =mime.extension(file.mimetype);
	  	cb(null, Math.random().toString(36).substr(2) + '-' + Date.now()+'.'+fileformat)
	}
})  
const upload = multer({ storage: storage })
var Enclosures = {};
// 连接数据库
var conn = mysql.createConnection(config.mysql);
conn.connect();
router.get('/get-work-data',getWorkData)
router.post('/add-work-data',upload.any(),AddWorkData)
//加班 - 上传图片
router.post('/upload-work-image',upload.any(), uploadWorkImage);
//请假 - 删除图片
router.post('/delete-work-image',upload.any(), deleteWorkImage);
// 请假 - 删除多条数据
router.post('/delete-one-data',deleteOneData)
function getWorkData(req,res){
	var selectAll=$sql.overtimeWork.selectAll;
   conn.query(selectAll,function(err,result){
      if(err){
			res.json({
				code:'error',
				msg:'获取数据失败，请刷新页面'
			})
		}
		res.json({
			code:'success',
			msg:'获取数据成功',
			result:result
		})
   })
}
function AddWorkData(req,res){
	var insertOne=$sql.overtimeWork.addOneData;
	var params = req.body;
	var userid=params.userid,
		username=params.username,
		
		createtime=params.createtime,
		startdate=params.startdate,
		enddate=params.enddate,
		starttime=params.starttime,
		endtime=params.endtime,
		workdays=params.workdays,
		workhours=params.workhours,
		overtime=params.overtime,
		workreason=params.workreason;	
	var 	create=remoment(createtime,0),
			start=remoment(startdate,getmillisecond(starttime)),
			end=remoment(enddate,getmillisecond(endtime));		
		conn.query(insertOne,
			[userid,username,create,start,end,workdays,workhours,overtime,workreason],
			function(err,result){
				if(err){
					res.json({
						code:'error',
						msg:'添加失败，请重新添加'
					})
				}
				res.json({
					code:'success',
					msg:'保存成功'
				})
		})
}
function uploadWorkImage(req,res){
	var uploadsql = $sql.overtimeWork.uploadImage,
		selectsl = $sql.overtimeWork.uploadSelect;
	var userid = req.body.userid,
		mysql_id = req.body.mysql_id,
		enclosure = req.files[0];
		enclosure.name= enclosure.originalname;	
	conn.query(selectsl, [mysql_id], function (err, result) {
		if (err) {
			res.json({
				code:'error',
				msg:'查询失败！'
			})
		}
		Enclosures[mysql_id] = result[0].enclosure ? result[0].enclosure:'[]';
		let oldEn = JSON.parse(Enclosures[mysql_id]);
		oldEn.push(enclosure)
		conn.query(uploadsql, [JSON.stringify(oldEn), mysql_id], function (err, result) {
			if (err) {			
				res.json({
					code:'error',
					msg:'上传失败~'
				})
			}
			if (result) {
				res.json({
					code:'success',
					msg:result
				})
			}
		})
	})
}
function deleteWorkImage(req,res){
	var selectsql = $sql.overtimeWork.ImageSelect;
	var deletesql=$sql.overtimeWork.Imagedelete;
	var param=req.body;
	conn.query(selectsql,[param.mysql_id],function(err,result){
		if (err) {			
			res.json({
				code:'error',
				msg:'查询失败'
			})
		}
		var olddata=(new Function("return "+result[0].enclosure))();
		var newdata=[];
		olddata.forEach(function(item){
			if(item.filename != param.filename){
				newdata.push(item)
			}
		})		
		conn.query(deletesql,[JSON.stringify(newdata),param.mysql_id],function(err,result){
			if (err) {			
				res.json({
					code:'error',
					msg:'失败'
				})
			}
			res.json({
				code:'success',
				msg:'删除成功'
			})
		})
	})
}
function deleteOneData(req,res){
	var sql = $sql.overtimeWork.deleteRow;
	var id=req.body.id;
	conn.query(sql,id,function(err,result){
		if(err){
			res.json({
				code:'error',
				msg:err
			})
		}
		if (result) {
			res.json({
				code:'success',
				msg:result
			})
		}
	})
}

module.exports = router;


function remoment(date,time){
	var result=0;
	if(isNaN(Number(date))){
		result=moment(date).toDate().getTime()+time;
	}else{
		result=Number(date)+time;
	}	
	return moment(result).format('YYYY-MM-DD HH:mm:ss');
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