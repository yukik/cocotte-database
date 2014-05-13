/* jshint unused:false, maxparams:10 */

/*
 * dependencies
 */
var msg    = require('cocotte-message')
  , is     = require('cocotte-is')
  , fs     = require('fs')
  , path   = require('path')
  , moment = require('moment');

/**
 * BLOBをファイルとして保存するモジュール
 * @class  Database.blobStore.File
 * @constructor
 * @param  {Obejct} schema
 * @param  {Object} database
 */
var FileStore = function FileStore (schema, database) {
	'use strict';

	if (!is(Object, schema)) {
		schema = {};
	}

	database = database || {};

	/**
	 * ファイル保存先
	 * @property {String} path
	 */
	this.path = is(String, schema.path) ? schema.path : process.cwd();

	if (!fs.existsSync(this.path)) {
		throw new Error('保存先ディレクトリが存在しません(' + this.path + ')');
	}

	/**
	 * 読取専用
	 */
	this.readonly = database.readonly;

	/**
	 * ファイル保存数
	 * @property {Number} count
	 */
	this.cnt = 0;
};

/**
 * BLOBを取得する
 * @method get
 * @param  {String} id
 * @param  {Stream} stream
 * @param  {Function} callback ({Error} err)
 * @return メソッドチェーン
 */
FileStore.prototype.get = function get (id, stream, callback) {
	'use strict';
	var readStream = fs.createReadStream(path.join(this.path, id));
	readStream.on('drain', function () {} )
			.on('error', function (err) {
				console.log(err);
			})
			.on('close', function () {})
			.on('pipe', function (src) {});

	//readStream.write(writeFile,'binary');//バイナリでお願いする
	readStream.end();

};

/**
 * BLOB書込Streamを取得します
 * @method writeStream
 * @param  {Function} callback ({Error} err, {String} id, {Stream} stream)
 * @return メソッドチェーン
 */
FileStore.prototype.writeStream = function writeStream (callback) {
	'use strict';
	var d      = new Date()
	  , id     = moment().format('YYYYMMDDHHmmss') + (this.cnt++)
	  , stream = fs.createWriteStream(path.join(this.path, id));
	callback(null, id, stream);
};

/**
 * ファイルを削除する
 * @method remove
 * @param  {String}   id
 * @param  {Function} callback
 * @return メソッドチェーン
 */
FileStore.prototype.remove = function remove (id, callback) {
	'use strict';
	try {
		fs.unlink(path.join(this.path, id), function (err) {
			if (is(Function, callback)) {
				callback(err);
			}
		});
	} catch (e) {
		if (is(Function, callback)) {
			callback(e);
		}
	}
};

module.exports = exports = FileStore;

// インターフェースチェック
// require('../../is-blob')(new FileStore());
