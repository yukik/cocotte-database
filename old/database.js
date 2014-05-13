/*
 * cocotte-database
 * Copyright(c) 2013 Yuki Kurata <yuki.kurata@gmail.com>
 * MIT Licensed
 */

/**
 * dependencies
 */
var is = require('cocotte-is')
  , path = require('path');

/*
 * データベース
 * データの取得・更新を行います
 * 
 * new Database(schema)で新しいデータベース接続を作成します。
 * 再利用可能なデータベース接続を作成する場合はDatabase.create(name, schema)です
 * 再利用時はDatabase.create(name)で取得します
 * 定義済みのデータベース接続を利用して作成する場合も
 * Database.create(name)で区別はありません
 *
 * @class Database
 */
var Database = require('./database-proto');

/**
 * 定義ファイル保存先
 * @property {String} schemaPath
 * @static
 */
Database.schemaPath = path.join(path.dirname(process.argv[1]), 'databases');

/**
 * インスタンス
 * @property {Object} instances
 * @static
 */
Database.instances = {};

/** 
 * データベース接続を作成し登録します
 * 
 * 作成された接続はDatabase.instancesで管理されます
 * 一時的な場合は、new Database(schema)で作成してください
 * 
 * @method set
 * @static
 * @param  {String}   name
 * @param  {Object}   schema
 * @param  {Function} callback
 * @return メソッドチェーン
 */
Database.set = function set (name, schema, callback) {
	'use strict';

	if (Database.instances[name]) {
		callback(new Error('既に登録されています'), null);
		return this;
	}

	try {
		var db = new Database(schema);
		Database.instances[name] = db;
		callback(null, db);

	} catch(e) {
		callback(e, null);
	}

	return this;
};

/**
 * 登録済みデータベースを取得する
 * 
 * @method get
 * @param  {String} name
 * @param  {Function} callback(err, database)
 * @return メソッドチェーン
 */
Database.get = function get (name, callback) {
	'use strict';

	// 作成済みインスタンス
	var db = Database.instances[name];

	// 登録済
	if (db) {
		callback(null, db);
		return this;
	}

	// 未登録時

	// 引数確認
	if (!is(String, name) || !/^[a-z]([_0-9a-z]{0,18}[0-9a-z])?$/i.test(name)) {
		callback(new TypeError('正しい名称ではありません'), null);
		return this;
	}

	// 定義済みスキーマを確認
	try {
		var schema = require(path.join(Database.schemaPath, name));
		db = new Database(schema);
		callback(null, db);


	} catch (e) {
		callback(e, null);

	}

	return this;
};

module.exports = exports = Database;