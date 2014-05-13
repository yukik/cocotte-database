/* jshint strict:false */

console.log(__filename);

var async = require('async')
  , task  = [];

var table = 'testdb';

var Database = require('cocotte-database');
var db1 = new Database();

console.log(db1);

task.push(function (next) {
	db1.find(table, function(err, result){
		console.log(result);
		next();
	});
});

task.push(function (next) {
	db1.find(table, ['name'], function(err, result){
		console.log(result);
		next();
	});
});

task.push(function (next) {
	db1.find(table, {name: 'b'}, function(err, result){
		console.log(result);
		next();
	});
});


task.push(function (next) {
	db1.find(table, null, {single: true}, function(err, result){
		console.log(result);
		next();
	});
});

async.series(task);



 (◕‿◕✿)