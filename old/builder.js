/**
 * dependencies
 */
var is = require('cocotte-is');

/**
 * クエリビルダー
 * 現在は単純なクエリ作成用のモジュール
 *
 * 必要に応じて拡張する予定(TODO参照)
 * TODO
 * １）メソッドチェーンに対応した更新方法変更
 *   チェーンした変更は、前の処理が完了したときに実行されるようになる
 *   例えば次の様なクエリは実際には動作が保証されていない
 *   builder.table('t1')
 *          .filter('rowno', 1).set('name', 'akai').updateOne()
 *          .filter('rowno', 2).set('name', 'aoi' ).updateOne();
 * ２）リレーションに対応
 *   現在はリレーションには対応していない
 * 
 * @class Builder
 * @constructor
 * @param {Database} database
 */
var Builder = function Builder (database) {
	'use strict';
	this.database = database;
	this.reset();
};

/**
 * データベース
 * @property {Database} database
 */
Builder.prototype.database = null;

/**
 * 初期値
 * @property {Object} defaultTo
 */
Builder.prototype.defaultTo = null;

/**
 * 初期値に戻す
 * @method reset
 * @return メソッドチェーン
 */
Builder.prototype.reset = function reset () {
	'use strict';
	this._table = null;
	this._fields = null;
	this._conditions = {};
	this._sort = null;
	this._limit = null;
	this._top = null;
	this._values = {};
};

/* 
 * テーブル名
 * @private
 */
Builder.prototype._table = null;

/**
 * テーブル名を設定する
 * @method table
 * @param  {String} name
 * @return メソッドチェーン
 */
Builder.prototype.table = function table (name) {
	'use strict';
	this._table = name;
	return this;
};

/* 
 * フィールド名
 * @private
 */
Builder.prototype._fields = null;

/**
 * フィールドを追加する
 * @method field
 * @param  {String} name
 * @return メソッドチェーン
 */
Builder.prototype.field = function field (name) {
	'use strict';
	if (!is(Array, this._fields)){
		this._fields = [name];

	} else if (!~this._fields.indexOf(name)) {
		this._fields.push(name);

	}
	return this;
};

/*
 * 条件 
 * @private
 */
Builder.prototype._conditions = null;

/**
 * 条件を追加する
 * @method filter
 * @param  {String} name
 * @param  {Mixed} value
 * @return メソッドチェーン
 */
Builder.prototype.filter = function filter (name, value) {
	'use strict';
	this._conditions[name] = value;
	return this;
};

/*
 * 並び順 
 * @private
 */
Builder.prototype._sort = null;

/**
 * 並び順を設定
 * @method sort
 * @param  {String} name
 * @param  {Boolean} desc 
 *           逆順の場合はtrue
 * @return メソッドチェーン
 */
Builder.prototype.sort = function sort (name, desc) {
	'use strict';
	if (!this.sort) {
		this.sort = [];
	}
	this.sort.push([name, desc ? -1 : 1]);
	return this;
};

/*
 * 行数
 * @private
 */
Builder.prototype._limit = null;

/**
 * 行数の設定
 * @method limit
 * @param  {Number} num
 * @return メソッドチェーン
 */
Builder.prototype.limit = function limit (num) {
	'use strict';
	this._limit = num;
	return this;
};

/*
 * 開始行
 * @private
 */
Builder.prototype._top = 0;

/**
 * 開始行を設定
 * @method top
 * @param  {Number} num
 * @return メソッドチェーン
 */
Builder.prototype.top = function top (num) {
	'use strict';
	this._top = num;
	return this;
};

/** 
 * 次頁
 * limit分をtopに加算する
 * @method nextPage
 * @return メソッドチェーン
 */
Builder.prototype.nextPage = function nextPage () {
	'use strict';
	this._top += this.limit;
	return this;
};

/**
 * 値の変更用
 * @property {Object}
 */
Builder.prototype._values = null;

/**
 * 取得(一行)
 * @method findOne
 * @param  {Function} callback
 * @return メソッドチェーン
 */
Builder.prototype.findOne = function findOne (callback) {
	'use strict';
	if (!this.database) {
		throw new TypeError('databaseが設定されていません');
	}

	if (!this._table) {
		throw new TypeError('tableが設定されていません');
	}

	if (!is(Function, callback)) {
		throw new TypeError('callbackが設定されていません');
	}
	var options = {};
	if (this._sort) {
		options.sort = this._sort;
	}
	if (this._top) {
		options.top = this._top;
	}

	this.database.findOne(this._table, this._conditions, this._fields, options, callback, true);

	return this;
};

/**
 * 取得 (複数行)
 * @method find
 * @param  {Function} callback
 * @return メソッドチェーン
 */
Builder.prototype.find = function find (callback) {
	'use strict';

	if (!this.database) {
		throw new TypeError('databaseが設定されていません');
	}

	if (!this._table) {
		throw new TypeError('tableが設定されていません');
	}

	if (!is(Function, callback)) {
		throw new TypeError('callbackが設定されていません');
	}

	var options = {};

	if (this._sort) {
		options.sort = this._sort;
	}

	if (this._limit) {
		options.limit = this._limit;
	}

	if (this._top) {
		options.top = this._top;
	}

	this.database.find(this._table, this._conditions, this._fields, options, callback, true);

	return this;
};

/**
 * 値の設定
 * @method set
 * @param  {String} field
 * @param  {Mixed}  value
 * @return メソッドチェーン
 */
Builder.prototype.set = function set (field, value) {
	'use strict';
	this._values[field] = value;
	return this;
};

/**
 * 追加
 * @method add
 * @param  {Function} callback
 * @return メソッドチェーン
 */
Builder.prototype.add = function add (callback) {
	'use strict';

	if (!this.database) {
		throw new TypeError('databaseが設定されていません');
	}

	if (!this._table) {
		throw new TypeError('tableが設定されていません');
	}

	this.database.add(this._table, this._values, callback);

	return this;
};

/**
 * 更新 (一行)
 * @method updateOne
 * @param {Function} callback 
 *             ({Error} err)
 * @return メソッドチェーン
 */
Builder.prototype.updateOne = function updateOne (callback) {
	'use strict';

	if (!this.database) {
		throw new TypeError('databaseが設定されていません');
	}

	if (!this._table) {
		throw new TypeError('tableが設定されていません');
	}

	this.database.updateOne(this._table, this._conditions, this._values, callback);

	return this;
};

/**
 * 更新 (複数行)
 * @method updateOne
 * @param {Function} callback 
 *             ({Error} err)
 * @return メソッドチェーン
 */
Builder.prototype.update = function update (callback) {
	'use strict';

	if (!this.database) {
		throw new TypeError('databaseが設定されていません');
	}

	if (!this._table) {
		throw new TypeError('tableが設定されていません');
	}

	this.database.update(this._table, this._conditions, this._values, callback);

	return this;
};

/**
 * 削除 (一行)
 * @method removeOne
 * @param  {Function} callback 
 *              ({Error} err)
 * @return メソッドチェーン
 */
Builder.prototype.removeOne = function removeOne (callback) {
	'use strict';

	if (!this.database) {
		throw new TypeError('databaseが設定されていません');
	}

	if (!this._table) {
		throw new TypeError('tableが設定されていません');
	}

	this.database.removeOne(this._table, this._conditions, null, callback, true);

	return this;
};

/**
 * 削除 (複数行)
 * @method removeOne
 * @param  {Function} callback 
 *              ({Error} err)
 * @return メソッドチェーン
 */
Builder.prototype.remove = function remove (callback) {
	'use strict';

	if (!this.database) {
		throw new TypeError('databaseが設定されていません');
	}

	if (!this._table) {
		throw new TypeError('tableが設定されていません');
	}

	this.database.remove(this._table, this._conditions, null, callback, true);

	return this;
};

module.exports = exports = Builder;
