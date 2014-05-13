/*
 * dependencies
 */
var is = require('cocotte-is')
  , EOL = require('os').EOL;

/*
 * 定義
 */
var schema = {};

// host
schema.host = {
	name       : 'host'
  , type       : 'String'
  , caption    : 'ホスト名'
  , required   : true
  , defaultTo  : '127.0.0.1'
  , example    : 'localhost, 192.168.11.111'
  , description: ['データベースのホスト名はIPアドレスでもかまいません'
				, 'ポート名は含まないでください'].join(EOL)
};
schema.host.sanitize = function hostSanitize (target, errs, prefix) {
	'use strict';
	var prop  = this.name
	  , value = target[prop]
	  , warn  = false
	  , name  = (prefix ? prefix + '.' : '') + prop;

	try {

		// 未設定チェック
		if (is.unset(value)) {
			warn = true;
			throw new Error('未設定です');
		}

		// 文字列チェック
		if (!is(String, value)) {
			throw new Error('文字列を設定してください');
		}

	} catch(e) {
		target[prop] = schema[prop].defaultTo;
		errs.push({name: name, message: e.message, warn: warn});
	}
};

// port
schema.port = {
	name       : 'port'
  , type       : 'Number'
  , caption    : 'ポート'
  , required   : false
  , defaultTo  : 27017
  , example    : '27017, 12345'
  , description: 'ポート番号は1-65535の範囲で設定してください'
};
schema.port.sanitize = function portSanitize (target, errs, prefix) {
	'use strict';
	var prop  = this.name
	  , value = target[prop]
	  , warn  = false
	  , name  = (prefix ? prefix + '.' : '') + prop;
　
	try {
		// 未設定
		if (is.unset(value)) {
			warn = true;
			throw new Error('未設定です');
		}

		// 整数チェック
		if (!is(Number, value) || ~~value !== value) {
			throw new Error('整数を設定してください');
		}

		// 範囲確認
		if (value < 1 || 65535 < value) {
			throw new Error('1-65535の間で設定してください');
		}

	} catch (e) {
		target[prop] = schema[prop].defaultTo;
		errs.push({name: name, message: e.message, warn: warn});
	}
};

// db
schema.db = {
	name       : 'db'
  , type       : 'String'
  , caption    : '接続先データベース'
  , required   : false
  , defaultTo  : 'cocotte'
  , example    : 'bizdb, dbz'
  , description: '指定のデータベース（コレクション）に接続します'
};
schema.db.sanitize = function dbSanitize (target, errs, prefix) {
	'use strict';
	var prop  = this.name
	  , value = target[prop]
	  , warn  = false
	  , name  = (prefix ? prefix + '.' : '') + prop;

	try {

		// 未設定
		if (is.unset(value)) {
			warn = true;
			throw new Error('未設定です');
		}

		// 文字列確認
		if (!is(String, value)) {
			throw new Error('文字列を設定してください');
		}

		// 正規表現チェック
		if (!/^[a-z][_0-9a-z]*$/i.test(value)) {
			throw new Error('不正なデータベース名です');
		}

	} catch (e) {
		target[prop] = schema[prop].defaultTo;
		errs.push({name: name, message: e.message, warn: warn});
	}
};

// pool
schema.pool = {
	name       : 'pool'
  , type       : 'Number'
  , caption    : 'コネクションプールの上限'
  , required   : false
  , defaultTo  : 1
  , example    : '1, 3, 10'
  , description: ['上限をあげる事でパフォーマンスは上昇しますが、'
				, 'メモリ消費量が増えます'].join(EOL)
};
schema.pool.sanitize = function poolSanitize (target, errs, prefix) {
	'use strict';
	var prop  = this.name
	  , value = target[prop]
	  , warn  = false
	  , name  = (prefix ? prefix + '.' : '') + prop;

	try {
		

		// 未設定
		if (is.unset(value)) {
			warn = true;
			throw new Error('未設定です');
		}

		// 整数チェック
		if (!is(Number, value) || ~~value !== value) {
			throw new Error('整数を設定してください');
		}

		// 範囲確認
		if (value < 1 || 100 < value) {
			throw new Error('1-100の間で設定してください');
		}

	} catch (e) {
		target[prop] = schema[prop].defaultTo;
		errs.push({name: name, message: e.message, warn: warn});
	}
};

module.exports = exports = schema;