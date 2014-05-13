/*
 * dependencies
 */
var is       = require('cocotte-is')
  , path     = require('path')
  , Database = require('./database')
  , EOL      = require('os').EOL;

/**
 * 定義
 * @class  cocotte-database.schema
 */
var schema = {};

// driver
schema.driver = {
	name       : 'driver'
  , type       : 'String'
  , caption    : 'データベースドライバ'
  , required   : true
  , defaultTo  : 'mongodb'
  , example    : 'mongodb'
  , description: 'データベースの種類毎にドライバを指定する必要があります'
};
schema.driver.sanitize = function driverSanitize (target, errs, prefix) {
	'use strict';
	var prop  = this.name
	  , value = target[prop]
	  , warn  = false
	  , name  = (prefix ? prefix + '.' : '') + prop;

	try {
		if (is.unset(value)) {
			warn = true;
			throw new Error('未設定です');
		}

		if (!is(String, value)) {
			throw new Error('文字列を設定してください');
		}

		if (!Database.drivers[value]) {
			throw new Error('ドライバが不明です');
		}

	} catch (e) {
		target[prop] = schema[prop].defaultTo;
		errs.push({name: name, message: e.message, warn: warn});
	}
};

// store
schema.store = {
	name       : 'store'
  , type       : 'Object'
  , caption    : 'データベース接続設定'
  , required   : false
  , defaultTo  : '{}'
  , example    : '{database: "cocotte"}'
  , description: ['ドライバ毎に設定内容が変わります。'
				, 'driver({String} driver)で内容を確認してください'].join(EOL)
};
schema.store.sanitize = function storeSanitize (target, errs, prefix) {
	'use strict';
	var prop   = this.name
	  , value  = target[prop]
	  , warn   = false
	  , name   = (prefix ? prefix + '.' : '') + prop
	  , driver = Database.drivers[target.driver] || null;

	try {
		if (is.unset(value)) {
			warn = true;
			throw new Error('未設定です');
		}

		if (!is(Object, value)) {
			throw new Error('オブジェクトではありません');
		}

		if (!driver) {
			throw new Error(
				'ドライバの設定がないため、検証を行う事ができません');
		}
		
		var drHelper = require(
				path.join(__dirname, 'drivers', target.driver, 'helper'));
		drHelper.sanitize(value, errs, name);

	} catch (e) {
		target[prop] = {};
		errs.push({name: name, message: e.message, warn: warn});
	}
};

// blob
schema.blob = {
	name       : 'blob'
  , type       : 'String'
  , caption    : 'BLOB格納方法'
  , required   : false
  , defaultTo  : 'file'
  , example    : 'file'
  , description: ['ファイル等のデータ格納方法です。'
				, '現在はfileのみ対応しています'].join(EOL)
};
schema.blob.sanitize = function blobSanitize (target, errs, prefix) {
	'use strict';
	var prop  = this.name
	  , value = target[prop]
	  , warn  = false
	  , name  = (prefix ? prefix + '.' : '') + prop;

	try {
		if (is.unset(value)) {
			warn = true;
			throw new Error('未設定です');
		}

		if (!is(String, value)) {
			throw new Error('文字列を設定してください');
		}

		if (!Database.blobDrivers[value]) {
			throw new Error('ドライバが不明です');
		}

	} catch (e) {
		target[prop] = schema[prop].defaultTo;
		errs.push({name: name, message: e.message, warn: warn});
	}
};

// blobStore
schema.blobStore = {
	name       : 'blobStore'
  , type       : 'Object'
  , caption    : 'BLOB格納方法設定'
  , required   : false
  , defaultTo  : '{}'
  , example    : '{path: "files"}'
  , description: ['BLOB格納方法毎に設定内容が変わります。'
				, 'blob({String} blobStore)で内容を確認してください'].join(EOL)
};
schema.blobStore.sanitize = function blobStoreSanitize (target, errs, prefix) {
	'use strict';
	var prop  = this.name
	  , value = target[prop]
	  , warn  = false
	  , name  = (prefix ? prefix + '.' : '') + prop
	  , blob  = Database.blobDrivers[target.blob] || null;

	try {

		if (is.unset(value)) {
			warn = true;
			throw new Error('未設定です');
		}

		if (!is(Object, value)) {
			throw new Error('オブジェクトではありません');
		}

		if (!blob) {
			throw new Error('ドライバが不明のため、検証を行う事が出来ません');
		}
		
		var blHelper = require(
					path.join(__dirname, 'blob-drivers', target.blob, 'helper'));
		blHelper.sanitize(value, errs, name);

	} catch (e) {
		target[prop] = {};
		errs.push({name: name, message: e.message, warn: warn});
	}
};

// valuesTable
schema.valuesTable = {
	name       : 'valuesTable'
  , type       : 'String'
  , capiton    : 'アプリケーション変数格納テーブル名'
  , required   : false
  , defaultTo  : 'val'
  , example    : 'app_values'
  , description: 'アプリケーション全体で使用する変数を格納する先を指定します'
};
schema.valuesTable.sanitize =
	function valuesTableSanitize (target, errs, prefix) {
	'use strict';
	var prop  = this.name
	  , value = target[prop]
	  , warn  = false
	  , name  = (prefix ? prefix + '.' : '') + prop;

	try {

		if (is.unset(value)) {
			warn = true;
			throw new Error('未設定です');
		}

		is.enableId(value, true);

	} catch (e) {
		target[this.name] = schema[this.name].defaultTo;
		errs.push({name: name, message: e.message, warn: warn});
	}
};

// blobTable
schema.blobTable = {
	name       : 'blobTable'
  , type       : 'String'
  , caption    : 'BLOB格納テーブル名'
  , required   : false
  , defaultTo  : 'blob'
  , example    : 'files'
  , description: 'BLOB情報を格納する先を指定します'
};
schema.blobTable.sanitize =
	function blobTableSanitize (target, errs, prefix) {
	'use strict';
	var prop  = this.name
	  , value = target[prop]
	  , warn  = false
	  , name  = (prefix ? prefix + '.' : '') + prop;

	try {
		if (is.unset(value)) {
			warn = true;
			throw new Error('未設定です');
		}

		is.enableId(value, true);

	} catch (e) {
		target[prop] = schema[prop].defaultTo;
		errs.push({name: name, message: e.message, warn: warn});
	}
};

// readonly
schema.readonly = {
	name       : 'readonly'
  , type       : 'Boolean'
  , caption    : '読取専用'
  , required   : false
  , defaultTo  : false
  , example    : 'true/false'
  , description: 'データの取得のみサポートする接続は、読取専用にしてください'
};
schema.readonly.sanitize = function readonlySanitize (target, errs, prefix) {
	'use strict';
	var prop  = this.name
	  , value = target[prop]
	  , warn  = false
	  , name  = (prefix ? prefix + '.' : '') + prop;

	try {
		if (is.unset(value)) {
			warn = true;
			throw new Error('未設定です');
		}

		if (!is(Boolean, value)) {
			throw new Error('true/falseを設定してください');
		}

	} catch (e) {
		target[prop] = false;
		errs.push({name: name, message: e.message, warn: warn});
	}
};

// modifySchema
schema.modifySchema = {
	name       : 'modifySchema'
  , type       : 'Boolean'
  , caption    : 'テーブル構成変更'
  , required   : false
  , defaultTo  : false
  , example    : 'true/false'
  , description: ['テーブル構成を変更する事が出来る場合はtrueにします'
				, 'データベース接続モジュール単体で使用する際には、許可の役割'
				, 'しか持ちません'
				, 'cocotteアプリケーション起動時にはモデル構成からテーブルを'
				, '作成・変更する機能が付加されます'
				, 'スキーマレスのDBではtrueに設定されていても上記の機能は動作'
				, 'しません'].join(EOL)
};
schema.modifySchema.sanitize = function modifySchemaSanitize (target, errs, prefix) {
	'use strict';
	var prop  = this.name
	  , value = target[prop]
	  , warn  = false
	  , name  = (prefix ? prefix + '.' : '') + prop;

	try {
		if (is.unset(value)) {
			warn = true;
			throw new Error('未設定です');
		}

		if (!is(Boolean, value)) {
			throw new Error('true/falseを設定してください');
		}
		
	} catch (e) {
		target[prop] = false;
		errs.push({name: name, message: e.message, warn: warn});
	}
};

module.exports = exports = schema;