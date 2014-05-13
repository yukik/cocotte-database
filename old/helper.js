/*
 * dependencies
 */
var EOL      = require('os').EOL
  , mixin    = require('cocotte-helper')
  , Database = require('./database');

/**
 * データベースヘルパー
 * @class Database.helper
 */
var helper = function helper () {
	'use strict';
	if (!mixin.enable) {
		return;
	}
	var hint = mixin.hint;
	console.log(
		['■' + helper.helperName + 'ヘルパーのメソッド一覧'
		,''
		,hint.template
		,hint.help
		,hint.help_name
		,hint.sanitize
		,hint.nameTest
		,hint.test
		,hint.list
		,'driver()'
		,'    ドライバの一覧'
		,''
		,'driver({String} driverName)'
		,'    指定ドライバのヘルパーの取得'
		,''
		,'blob()'
		,'    BLOB格納方法の一覧'
		,''
		,'blob({String} name)'
		,'    指定BLOB格納方法のヘルパー取得'
		,''
		,hint.enable
		].join(EOL));
};

/**
 * ヘルパー名
 * @property {String} helperName
 */
helper.helperName = 'データベース接続';

/**
 * 定義オブジェクト情報
 * @property {Object} schema
 */
helper.schema = require('./schema');

/**
 * テンプレートの出力
 * @method template
 */
helper.template = function template() {
	'use strict';
	if (!mixin.enable) {
		return;
	}
	console.log(
		['■' + helper.helperName + 'のテンプレート'
		,'var schema = {'
		,'\tdriver: \'mongodb\''
		,'  , store : {'
		,'\t\thost: \'localhost\''
		,'\t  , port: 27017'
		,'\t  , db  : \'cocotte\''
		,'\t  , pool: 1'
		,'\t}'
		,'  , blob : \'file\''
		,'  , blobStore: {'
		,'\t\tpath: \'/usr/local/cocotte/databases\''
		,'\t}'
		,'  , valuesTable: \'val\''
		,'  , blobTable: \'blob\''
		,'  , readonly: false'
		,'  , modifySchema: false'
		,'};'
		,'module.exports = exports = schema;'
		,''
		,''
		].join(EOL));
};

/**
 * プロパティ情報表示
 * @method help
 * @param {String} name
 */
helper.help = mixin.help;

/**
 * 無害化
 * @method sanitize
 * @param  {Object} target
 * @param  {Array}  errs   省略可能
 * @param  {String} prefix 省略可能
 * @return {Object} schema
 */
helper.sanitize = mixin.sanitize;

/**
 * 名称に使用出来ない予約語
 * @property {Array} reservedWords
 */
helper.reservedWords = [];

/**
 * 定義名のテスト
 * @method nameTest
 * @param  {String} name 省略時ファイル名
 */
helper.nameTest = mixin.nameTest;

/**
 * 定義テスト
 * @method test
 * @param  {Object}  target
 * @param  {Boolean} warn
 */
helper.test = mixin.test;

/**
 * 定義済み一覧保管ディレクトリ
 * @property {String} listDir
 */
helper.listDir = '../databases';

/**
 * 定義済み一覧
 * @method list
 * @param {String} dir
 * @param {String} dir2
 */
helper.list = mixin.list;

/**
 * ドライバの一覧もしくはヘルパーの取得
 * @method driver
 * @param  {String} name
 */
helper.driver = function driver (name) {
	'use strict';
	if (!mixin.enable) {
		return;
	}

	// 指定ドライバのヘルパーを取得
	if (name) {
		var dr = Database.drivers[name];
		if (dr) {
			return require('./drivers/' + name + '/helper');
		} else {
			return null;
		}

	// ドライバ一覧の取得
	} else {
		console.log('■' + helper.helperName + 'のDBドライバ一覧');
		Object.keys(Database.drivers).forEach(function (dr) {
			console.log('  * ' + dr);
		});
		console.log();
		console.log();
	}
};

/**
 * BLOB格納方法の一覧もしくはヘルパーの取得
 * @method blob
 * @param  {String} name
 */
helper.blob = function blob (name) {
	'use strict';
	if (!mixin.enable) {
		return;
	}

	// 指定BLOB格納方法のヘルパーを取得
	if (name) {
		var dr = Database.blobDrivers[name];
		if (dr) {
			return require('./blob-drivers/' + name + '/helper');
		} else {
			return null;
		}

	// BLOB格納方法一覧の取得
	} else {
		console.log('■' + helper.helperName + 'のBLOB格納方法一覧');
		Object.keys(Database.drivers).forEach(function (dr) {
			console.log('  * ' + dr);
		});
		console.log();
		console.log();
	}
};

module.exports = exports = helper;