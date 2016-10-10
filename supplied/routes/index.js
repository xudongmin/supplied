var crypto = require('crypto'),
    ZbannuncePost = require('../model/SrmAdministration.js');
var express = require('express');
var router = express.Router();
var multer = require('multer');

/* GET home page. */
//加载主页
router.get('/', function(req, res, next) {
	//判断是否是第一页，并把请求的页数转换成number 类型
	var page = parseInt(req.query.p) || 1;

	//查询并返回第 page 页的5篇公告信息
	ZbannuncePost.getFive(null, page, function (err, zbannunces, total) {
		if (err) {
			zbannunces = [];
		}
		res.render('index', { 
			title: '比亚迪供应商门户',
		 	zbannunces: zbannunces,
		 	page: page,
		 	isFirstPage: (page - 1) == 0,
		 	isLastPage: ((page -1) * 5 + zbannunces.length) == total
		});
	})
  	
});

// 加载管理员页面
router.get('/SrmAdministration', function(req, res , next) {
	//判断是否是第一页，并把请求的页数转换成number 类型
	var page = parseInt(req.query.p) || 1;
	
	//查询并返回第 page 页的5篇公告信息
	ZbannuncePost.getFive(null, page, function (err, zbannunces, total) {
		if (err) {
			zbannunces = [];
		}
		res.render('SrmAdministration', { 
			title: '比亚迪供应商门户管理',
		 	zbannunces: zbannunces,
		 	page: page,
		 	isFirstPage: (page - 1) == 0,
		 	isLastPage: ((page -1) * 5 + zbannunces.length) == total
		});
	});
});

//招标公告信息发布
router.post('/SrmAdministration', function(req, res) {
	var zapost = new ZbannuncePost(req.body.zb_type, req.body.zb_project_description, req.body.zb_project_no, req.body.zb_project_city, req.body.zb_project_date, req.body.zb_project_address, req.body.zb_flie_je, req.body.zb_vendor_bond, req.body.zb_corporation, req.body.zb_buyer, req.body.zb_contactor, req.body.zb_tel, req.body.zb_mail, req.body.zb_answer_date, req.body.zb_bid_start_date, req.body.zb_bid_end_date, req.body.zb_open_date, req.body.zb_appeal_date, req.body.zb_enrol_end_date, req.body.zb_memo, req.body.zbfileinput);	
	zapost.save(function(err) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success','发布成功!');
		res.redirect('/SrmAdministration');//发表成功跳转到SrmAdministration页面
	});
});

//加载渲染SupplierSignup招标公告详情页面
router.get('/SupplierSignup/:_id', function (req, res) {
	ZbannuncePost.getOne(req.params._id, function (err, zbannunce) {
		if (err) {
			return res.redirect('/');
		}
		res.render('SupplierSignup', {
			title: "比亚迪供应商门户报名",
			zbannunce: zbannunce
		})
	})
});

module.exports = router;
