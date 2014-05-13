/*
 * dependencies
 */
var EOL  = require('os').EOL
  , path = require('path')
  , fs   = require('fs')
  , is   = require('cocotte-is');

var schema = {};

// path
schema.path = {
	name       : 'path'
  , type       : 'String'
  , caption    : '保存ディレクトリ'
  , required   : false
  , defaultTo  : path.join(process.cwd(), 'files')
  , example    : '/usr/blob_data'
  , description: ['存在する書込み可能なディレクトリを指定してください。'
				, '存在しないディレクトリを設定した場合は設定されません'].join(EOL)
};
schema.path.sanitize = function pathSanitize (target, errs, prefix) {
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

		// 文字列チェック
		if (!is(String, value)) {
			throw new Error('文字列を設定してください');
		}

		// ディレクトリ確認
		if (!fs.existsSync(value)) {
			throw new Error('指定のディレクトリが見つかりません');
		}

	} catch (e) {
		target[prop] = schema[prop].defaultTo;
		errs.push({name: name, message: e.message, warn: warn});
	}
};

module.exports = exports = schema;