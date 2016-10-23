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

//系统公告发布方法
function XTggPost(gonggaotitle, gonggaocontent, gonggaoarea, gonggaobuilder) {
	this.gonggaotitle = gonggaotitle; //公告标题
	this.gonggaocontent = gonggaocontent; //公告内容
	this.gonggaoarea = gonggaoarea; //发布地区
	this.gonggaobuilder = gonggaobuilder; //发布人
}

module.exports = XTggPost;

//存储一份系统公告信息
XTggPost.prototype.save = function (callback) {
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
  	//要存入数据库的系统公告信息
  	var gonggaoinfo = {
  		time: time,
  		gonggaotitle: this.gonggaotitle,
  		gonggaocontent: this.gonggaocontent,
  		gonggaoarea: this.gonggaoarea,
  		gonggaobuilder: this.gonggaobuilder
  	};

  	//打开数据库
  	pool.acquire(function (err, mongodb) {
  		if (err) {
  			return callback(err);
  		}
  		//读取 gonggaoinfos 集合
  		mongodb.collection('gonggaoinfos', function (err, collection) {
  			if (err) {
  				pool.release(mongodb);
  				return callback(err);
  			}
  			//将招标公告信息插入 gonggaoinfos 集合
  			collection.insert(gonggaoinfo, {
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
}

//一次获取10篇招标信息
XTggPost.getTen = function(gonggaotitle, page, callback) {
	//打开数据库
	pool.acquire(function (err, mongodb) {
		if (err) {
			return callback(err);
		}
		//读取  zbannunces 集合
		mongodb.collection('gonggaoinfos', function (err, collection) {
			if (err) {
				pool.release(mongodb);
				return callback(err);
			}
			var query = {};
			if (gonggaotitle) {
				query.gonggaotitle = gonggaotitle;
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
XTggPost.getOne = function(_id, callback) {
	//打开数据库
	pool.acquire(function (err, mongodb) {
		if (err) {
			return callback(err);
		}
		//读取zbannunces 集合
		mongodb.collection('gonggaoinfos', function (err, collection) {
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