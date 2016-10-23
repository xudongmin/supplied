var crypto = require('crypto'),
    ZbannuncePost = require('../model/SrmAdministration.js'),
    XTggPost = require('../model/XTpost.js'),
    CGpolicyPost = require('../model/CGpost.js');
var express = require('express');
var router = express.Router();
var multer = require('multer');

/* GET home page. */
//加载主页
router.get('/', function(req, res, next) {
	//判断是否是第一页，并把请求的页数转换成number 类型
	var page = parseInt(req.query.p) || 1;

	// CGpolicyPost.getFive(null, page, function (err, cgpolicys, total) {
	// 	if(err) {
	// 		cgpolicys = [];
	// 	}
	// 	res.render('index', {
	// 		title: '比亚迪供应商门户',
	// 		cgpolicys: cgpolicys
	// 	});
	// });

	//查询招标公告并返回第 page 页的5篇公告信息
	var zbannunces = ZbannuncePost.getFive(null, page, function (err, zbannunces, total) {
		if (err) {
			zbannunces = [];
		}
	});
	console.log(zbannunces);
	res.render('index', { 
		title: '比亚迪供应商门户',
	 	zbannunces: zbannunces,
	 	page: page,
	 	totalpages: Math.ceil(total/5),
	 	isFirstPage: (page - 1) == 0,
	 	isLastPage: ((page -1) * 5 + zbannunces.length) == total
	});
		
});

//加载招标公告列表页
router.get('/SupplierSignup/zblists', function(req, res, next) {
	//判断是否是第一页，并把请求的页数转换成number 类型
	var page = parseInt(req.query.p) || 1;

	//查询并返回第 page 页的10篇公告信息
	ZbannuncePost.getTen(null, page, function (err, zbannunces, total) {
		if (err) {
			zbannunces = [];
		}
		res.render('zblists', { 
			title: '招标公告列表',
		 	zbannunces: zbannunces,
		 	page: page,
		 	totalpages: Math.ceil(total/10),
		 	isFirstPage: (page - 1) == 0,
		 	isLastPage: ((page -1) * 10 + zbannunces.length) == total
		});
	});
});

// 加载管理员页面
router.get('/SrmAdministration', function(req, res , next) {
	//判断是否是第一页，并把请求的页数转换成number 类型
	var page = parseInt(req.query.p) || 1;
	
	//查询并返回第 page 页的5篇公告信息
	ZbannuncePost.getFive(null, page, function (err, zbannunces, total, totallength) {
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

//加载后台招标公告查看列表页
router.get('/SupplierSignup/adminzblists', function(req, res, next) {
	//判断是否是第一页，并把请求的页数转换成number 类型
	var page = parseInt(req.query.p) || 1;

	//查询并返回第 page 页的10篇公告信息
	ZbannuncePost.getTen(null, page, function (err, zbannunces, total) {
		if (err) {
			zbannunces = [];
		}
		res.render('adminzblists', { 
			title: '采购招标公告查询',
		 	zbannunces: zbannunces,
		 	page: page,
		 	totalpages: Math.ceil(total/10),
		 	isFirstPage: (page - 1) == 0,
		 	isLastPage: ((page -1) * 10 + zbannunces.length) == total
		});
	})
});


//招标公告信息发布
router.post('/SrmAdministration', function(req, res) {
	var zapost = new ZbannuncePost(req.body.zb_type, req.body.zb_project_description, req.body.zb_project_no, req.body.zb_project_city, req.body.zb_project_date, req.body.zb_project_address, req.body.zb_flie_je, req.body.zb_vendor_bond, req.body.zb_corporation, req.body.zb_buyer, req.body.zb_contactor, req.body.zb_tel, req.body.zb_mail, req.body.zb_answer_date, req.body.zb_bid_start_date, req.body.zb_bid_end_date, req.body.zb_open_date, req.body.zb_appeal_date, req.body.zb_enrol_end_date, req.body.zb_memo, req.body.zbfileinput);	
	zapost.save(function(err) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/');
		};
		req.flash('success','发布成功!');
		res.redirect('/SrmAdministration');//发表成功跳转到SrmAdministration页面
	});
});

//系统公告信息发布
router.post('/SrmAdministration/:XTpost', function(req, res) {
	var xtggpost = new XTggPost(req.body.gonggaotitle, req.body.gonggaocontent, req.body.gonggaoarea, req.body.gonggaobuilder);
	xtggpost.save(function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/SrmAdministration');
		};
		req.flash('success', '发布成功!');
		res.redirect('/SrmAdministration');//发表成功跳转到SrmAdministration页面
	});
});

//采购政策发布
router.post('/CGpost', function(req, res) {
	var cgpolicyPost = new CGpolicyPost(req.body.CGtitle, req.body.CGcontent, req.body.CGbuilder);
	cgpolicyPost.save(function(err) {
		if(err) {
			req.flash('error', err);
			return res.redirect('/');
		};
		req.flash('success', '发布成功!');
		res.redirect('/SrmAdministration'); //发表成功跳转到SrmAdministration页面
	});
});

//加载系统公告首页列表
router.get('/XTpost', function(req, res, next) {
	//判断是否是第一页，并把请求的页数转换成number 类型
	var page = parseInt(req.query.p) || 1;
	//查询系统公告并返回第 page 页的5篇信息
	XTggPost.getTen(null, page, function (err, gonggaoinfos, total) {
		if (err) {
			gonggaoinfos = [];
		}
		res.render('XTpost', {
			title: "系统公告",
		 	gonggaoinfos: gonggaoinfos,
		 	page: page,
		 	totalpages: Math.ceil(total/10),
		 	isFirstPage: (page - 1) == 0,
		 	isLastPage: ((page -1) * 10 + gonggaoinfos.length) == total
		});
	});
})

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

//加载渲染系统公告详情页面
router.get('/XTpost/:_id', function (req, res) {
	XTggPost.getOne(req.params._id, function (err, gonggaoinfo) {
		if (err) {
			return res.redirect('/');
		}
		res.render('XTdetail', {
			title: "系统公告详情",
			gonggaoinfo: gonggaoinfo
		})
	})
});

module.exports = router;
