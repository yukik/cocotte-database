/* jshint strict:false */

var table = 'user';

var schema = {
	name: 'db1'
  , driver: 'mongodb'
  , store : {}
};

// データベース
var Database = require('cocotte-database');

var db = new Database(schema);

// ビルダー
var Builder = require('cocotte-database/builder');
var bld = new Builder(db);

// クエリの実行
bld.table(table)
   .filter('rowno', 3)
   .field('name')
   .findOne(function (err, result) {
		console.log(result);
	});
