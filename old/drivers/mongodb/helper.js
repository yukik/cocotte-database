/*
 * dependencies
 */
var EOL   = require('os').EOL
  , mixin = require('cocotte-helper');

/**
 * DBドライバ - mongodbヘルパー
 * @method helper
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
		,hint.test
		,hint.enable
		].join(EOL));
};

/**
 * ヘルパー名
 * @property {String} helperName
 */
helper.helperName = 'DBドライバ - mongodb';

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
		,'{'
		,'\thost: \'localhost\''
		,'  , port: 27017'
		,'  , db  : \'cocotte\''
		,'  , pool: 1'
		,'}'
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
 * 定義テスト
 * @method test
 * @param  {Object} target
 */
helper.test = mixin.test;

module.exports = exports = helper;