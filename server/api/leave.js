const path = require('path')

const express = require('express');
const mysql = require('mysql');
const multer = require("multer");
const mime = require("mime-types");

const config = require('../config/server.json');
const $sql = require('../config/sqlmap.json');

const router = express.Router();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  	cb(null, path.resolve(__dirname, '../../public/uploads'))
	},
	filename: function (req, file, cb) {
		var fileformat =mime.extension(file.mimetype);
	  	cb(null, Math.random().toString(36).substr(2) + '-' + Date.now()+'.'+fileformat)
	}
  })  
const upload = multer({ storage: storage })

// var upload = multer({ dest: path.resolve(__dirname, '../../public/uploads') });
var Enclosures = {};

// 连接数据库
var conn = mysql.createConnection(config.mysql);
conn.connect();

// 获取多有数据
router.get('/getData',getData);

// 获取某时间段数据
router.post('/getOneData',getOneData);
//获取某月数据
router.post('/get-month-data',getMonthData);
//请假 - 插入数据
router.post('/addOneData',upload.any(),addOneData);
// 请假 - 删除多条数据
router.post('/deleteData',deleteData)
//请假 - 上传图片
router.post('/uploadOneData',upload.any(), uploadOneData);
//请假 - 删除图片
router.post('/deleteImage',upload.any(), deleteImage);
module.exports = router;

function getData(req, res){
	var sql = $sql.askForLeave.selectAll;
	conn.query(sql,function(err, result) {
		if (err) {
			res.json({
				code:'error',
				msg:err
			})
		}
		if (result) {
			jsonWrite(res, result);
		}
	})
}

function getOneData(req, res){
	var sql = $sql.askForLeave.selectOne;
	var params = req.body;	
	conn.query(sql,[params.startTime],function(err, result) {
		if (err) {
			res.json({
				code:'error',
				msg:err
			})
		}
		if (result) {
			jsonWrite(res, result);
		}
	})
}
function getMonthData(req,res){
	var sql = $sql.askForLeave.selectMonth;
	var params = req.body;	
	conn.query(sql,[params.startTime+'%'],function(err, result) {
		if (err) {
			res.json({
				code:'error',
				msg:err
			})
		}
		if (result) {
			jsonWrite(res, result);
		}
	})
}
function addOneData(req, res){
	var addsql = $sql.askForLeave.addOneData,
		selectsql=$sql.askForLeave.selectTime;
	var params = req.body;
	var userid=params.userid,
		username=params.username,
		
		createtime=params.createtime,
		starttime=params.starttime,
		endtime=params.endtime,

		leavetype=params.leavetype,
		timetype=params.timetype,
		countdays=params.countdays,
		counthours=params.counthours,
		totaltime=params.totaltime,
		reason=params.reason;
	conn.query(selectsql,[userid,starttime,endtime],function(err,seltdata){
		if(err){
			res.json({
				code:'error',
				msg:'数据保存失败~'
			})
		}
		if(seltdata.length>0){
			res.json({
				code:'error',
				msg:'休假时间已被占用，不能再次休假'
			})
		}else{
			conn.query(addsql,[userid,username,leavetype,createtime,starttime,endtime,timetype,countdays,counthours,totaltime,reason],function(err, result) {
				if (err) {		
					res.json({
						code:'error',
						msg:'数据保存失败~'
					})
				}	
				if(result){
					res.json({
						code:'success',
						msg:result
					})
				}
			})
		}		
	})	
	
}
function deleteData(req,res){
	var sql = $sql.askForLeave.deleteData;
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
function uploadOneData(req, res){	
	var uploadsql = $sql.askForLeave.uploadData,
		selectsl = $sql.askForLeave.uploadSelect;
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
function deleteImage(req,res){
	var selectsql = $sql.askForLeave.ImageSelect;
	var deletesql=$sql.askForLeave.Imagedelete;
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
function jsonWrite(res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code: '1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};