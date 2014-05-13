/*
 * dependenceis
 */
var is = require('cocotte-is');

/**
 * ドライバインターフェース用
 *
 * @interface IDriver
 * @constructor
 * @param {Object} schema
 */
var isDriver = function isDriver (target) {
	'use strict';

	// プロパティ
	var properties = [

			/**
			 * 行ID名
			 * @property {String} rowIdName
			 */
			'rowIdName'
		];

	// メソッド
	var methods = [

			/**
			 * テーブル構成を取得する
			 * @method createTable
			 * @param {String}   name
			 * @param {Function} callback ({Error} err, {Object} schema)
			 * @return メソッドチェーン
			 */
			'getSchema'

			/**
			 * テーブルを作成する
			 * @method createTable
			 * @param {String}   name
			 * @param {Object}   schema
			 * @param {Function} callback ({Error} err)
			 * @return メソッドチェーン
			 */
		  , 'createTable'

			/**
			 * テーブルを変更する
			 * @method dropTable
			 * @param {String}   name
			 * @param {Object}   schema
			 * @param {Function} callback ({Error} err)
			 * @return メソッドチェーン
			 */
		  , 'alterTable'

			/**
			 * テーブルを削除する
			 * @method dropTable
			 * @param {String}   table
			 * @param {Function} callback ({Error} err)
			 * @return メソッドチェーン
			 */
		  , 'dropTable'

			/**
			 * インデックスの追加
			 * @method  addIndex
			 * @param  {String}   table
			 * @param  {Array}    fields
			 * @param  {Function} callback ({Error} err)
			 * @return メソッドチェーン
			 */
		  , 'addIndex'

			/**
			 * インデックスの削除
			 * @method removeIndex
			 * @param  {String}   table
			 * @param  {Array}    fields
			 * @param  {Function} callback ({Error} err)
			 * @return メソッドチェーン
			 */
		  , 'removeIndex'

			/**
			 * 行IDの作成
			 * @method createId
			 * @param  {Object}   options
			 * @param  {Function} callback
			 * @return {String}   RowID
			 */
		  , 'createId'

			/**
			 * 取得
			 * @method find
			 * @param  {String}   table
			 * @param  {Object}   selector
			 * @param  {Array}    fields
			 * @param  {Object}   options
			 * @param  {Function} callback ({Error} err, {Mixed} result)
			 * @return メソッドチェーン
			 */
		  , 'find'

			/**
			 * 行の追加
			 * @method add
			 * @param {String}   table
			 * @param {Object}   data
			 * @param {Object}   options
			 * @param {Function} callback ({Error} err)
			 * @return メソッドチェーン
			 */
		  , 'add'

			/**
			 * 行の更新
			 * @method  update
			 * @param {String}   table
			 * @param {Object}   selector
			 * @param {Object}   data
			 * @param {Object}   options
			 * @param {Function} callback ({Error} err)
			 * @return メソッドチェーン
			 */
		  , 'update'

			/**
			 * 行の削除
			 * @method remove
			 * @param {String}   table
			 * @param {Object}   selector
			 * @param {Object}   options
			 * @param {Function} callback ({Error} err)
			 * @return メソッドチェーン
			 */
		  , 'remove'

			/**
			 * (ドライバ依存)
			 * ドライバ固有のクエリを実行する
			 * @method query
			 * @param  {Mixed}    command
			 * @param  {Boolean}  readonly
			 * @param  {Function} callback ({Error} err, {Mixed} result)
			 * @return メソッドチェーン
			 */
		  , 'query'

			/**
			 * (ドライバ依存)
			 * ドライバを取得する
			 * @method getDriver
			 * @return {Mixed} driver
			 */
		  , 'getDriver'

			/**
			 * (ドライバ依存)
			 * 接続情報を取得する
			 * @method getConnectionInfo
			 * @return {Mixed} connectionInfo
			 */
		  , 'getConnectionInfo'
		];

	// チェック
	is.interfaceCheck(target, properties, methods);
};

module.exports = exports = isDriver;