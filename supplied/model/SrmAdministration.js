var Db = require('./db');
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
	name: 'mongoPool',
	create : function(callback) {
		var mongodb = Db();
		mongodb.open(function (err, db) {
			callback(err, db);
		})
	},
	destroy : function(mongodb) {
		mongodb.close();
	},
	max : 100,
	min : 5,
	idleTimeoutMillis : 30000,
	log : true
});

var ObjectID = require('mongodb').ObjectID;

//招标公告发布方法
function ZbannuncePost(zb_type, zb_project_description, zb_project_no, zb_project_city, zb_project_date, zb_project_address, zb_flie_je, zb_vendor_bond, zb_corporation, zb_buyer, zb_contactor, zb_tel, zb_mail, zb_answer_date, zb_bid_start_date, zb_bid_end_date, zb_open_date, zb_appeal_date, zb_enrol_end_date, zb_memo, zbfileinput) {
	this.zb_type = zb_type; //招标类型
	this.zb_project_description = zb_project_description; //项目名称
	this.zb_project_no = zb_project_no; //项目编号
	this.zb_project_city = zb_project_city; //招标地区
	this.zb_project_date = zb_project_date; //购买招标/采购文件时间
	this.zb_project_address = zb_project_address; //购买招标/采购文件地点
	this.zb_flie_je = zb_flie_je; //招标/采购文件售价
	this.zb_vendor_bond = zb_vendor_bond; //投标保证金
	this.zb_corporation = zb_corporation; //法人名称
	this.zb_buyer = zb_buyer; //资源开发/采购专责
	this.zb_contactor = zb_contactor; //联系人
	this.zb_tel = zb_tel; //联系电话
	this.zb_mail = zb_mail; //邮箱
	this.zb_answer_date = zb_answer_date; //答疑开始时间
	this.zb_bid_start_date = zb_bid_start_date; //投标开始时间
	this.zb_bid_end_date = zb_bid_end_date; //投标截止时间
	this.zb_open_date = zb_open_date; //开标时间
	this.zb_appeal_date = zb_appeal_date; //申诉时间
	this.zb_enrol_end_date = zb_enrol_end_date; //报名截止时间
	this.zb_memo = zb_memo; //备注
	this.zbfileinput = zbfileinput; //附件
}

module.exports = ZbannuncePost;

//存储一份招标公告信息
ZbannuncePost.prototype.save = function (callback) {
	var date = new Date();
	//存储各种时间格式，方便以后扩展
	var time = {
	    date: date,
    	year : date.getFullYear(),
	    month : date.getFullYear() + "-" + (date.getMonth() + 1),
	    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
	    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
	    date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  	}
  	//要存入数据库的招标信息
  	var zbannunce = {
  		time: time,
  		zb_type : this.zb_type,
  		zb_project_description : this.zb_project_description,
  		zb_project_no : this.zb_project_no,
  		zb_project_city : this.zb_project_city,
  		zb_project_date : this.zb_project_date,
  		zb_project_address : this.zb_project_address,
  		zb_flie_je : this.zb_flie_je,
  		zb_vendor_bond : this.zb_vendor_bond,
  		zb_corporation : this.zb_corporation,
  		zb_buyer : this.zb_buyer,
  		zb_contactor : this.zb_contactor,
  		zb_tel : this.zb_tel,
  		zb_mail : this.zb_mail,
  		zb_answer_date : this.zb_answer_date,
  		zb_bid_start_date : this.zb_bid_start_date,
  		zb_bid_end_date : this.zb_bid_end_date,
  		zb_open_date : this.zb_open_date,
  		zb_appeal_date : this.zb_appeal_date,
  		zb_enrol_end_date : this.zb_enrol_end_date,
  		zb_memo : this.zb_memo,
  		zbfileinput : this.zbfileinput
  	};

  	//打开数据库
  	pool.acquire(function (err, mongodb) {
  		if (err) {
  			return callback(err);
  		}
  		//读取 zbannunces 集合
  		mongodb.collection('zbannunces', function (err, collection) {
  			if (err) {
  				pool.release(mongodb);
  				return callback(err);
  			}
  			//将招标公告信息插入 zbannunces 集合
  			collection.insert(zbannunce, {
  				safe: true
  			}, function (err) {
  				pool.release(mongodb);
  				if (err) {
  					return callback(err); //失败！返回 err
  				}
  				callback(null); //返回 err 为 null
  			});
  		});
  	});
};

//一次获取5篇招标信息
ZbannuncePost.getFive = function(zb_project_description, page, callback) {
	//打开数据库
	pool.acquire(function (err, mongodb) {
		if (err) {
			return callback(err);
		}
		//读取  zbannunces 集合
		mongodb.collection('zbannunces', function (err, collection) {
			if (err) {
				pool.release(mongodb);
				return callback(err);
			}
			var query = {};
			if (zb_project_description) {
				query.zb_project_description = zb_project_description;
			}

			//使用 count 返回特定查询招标文档个数 total
			collection.count(query, function (err, total) {
				//根据 query 对象查询，并跳过前 (page-1)*5 个结果，返回之后的 5 个结果
				collection.find(query, {
					skip: (page - 1)*5,
					limit: 5
				}).sort({
					time: -1
				}).toArray(function (err, docs) {
					pool.release(mongodb);
					if (err) {
						return callback(err);
					}
					callback(null, docs, total);
				});
			});
		});
	});
};

//一次获取10篇招标信息
ZbannuncePost.getTen = function(zb_project_description, page, callback) {
	//打开数据库
	pool.acquire(function (err, mongodb) {
		if (err) {
			return callback(err);
		}
		//读取  zbannunces 集合
		mongodb.collection('zbannunces', function (err, collection) {
			if (err) {
				pool.release(mongodb);
				return callback(err);
			}
			var query = {};
			if (zb_project_description) {
				query.zb_project_description = zb_project_description;
			}

			//使用 count 返回特定查询招标文档个数 total
			collection.count(query, function (err, total) {
				//根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
				collection.find(query, {
					skip: (page - 1)*10,
					limit: 10
				}).sort({
					time: -1
				}).toArray(function (err, docs) {
					pool.release(mongodb);
					if (err) {
						return callback(err);
					}
					callback(null, docs, total);
				});
			});
		});
	});
};

//根据ID获取一篇公告信息
ZbannuncePost.getOne = function(_id, callback) {
	//打开数据库
	pool.acquire(function (err, mongodb) {
		if (err) {
			return callback(err);
		}
		//读取zbannunces 集合
		mongodb.collection('zbannunces', function (err, collection) {
			if (err) {
				pool.release(mongodb);
				return callback(err);
			}
			//根据id查询公告信息
			collection.findOne({
				"_id": new ObjectID(_id)
			}, function (err, doc) {
				if (err) {
					pool.release(mongodb);
					return callback(err);
				}
				callback(null, doc);//返回查询的一篇招标公告
			})
		});
	});
};

