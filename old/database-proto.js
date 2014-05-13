/* jshint maxparams:7 */

/*
 * データベース接続
 * new Database(schema)でデータベースを作成します。
 *
 */

/*
 * dependencies
 */
var path = require('path');
var is = require('cocotte-is');
var term = require('cocotte-term');

/*
 * 規定のドライバ
 */
var defaultDriver = 'mongodb';
var defaultBlob = 'file';

/**
 * データベース接続
 *
 * データベースへの接続を行い、データの取得・保存を行います
 * @class Database
 * @constructor 
 * @extends BuiltIn
 * @param {Object} schema
 */
var Database = function Database (schema) {
  'use strict';

  // 変数チェック
  if (!is(Object, schema)) {
    schema = {};
  }

  /**
   * ドライバ
   * @property {Driver} driver
   */
  var driver = schema.driver || defaultDriver;
  if (!is(String, driver) || !/^[a-z]([_0-9a-z]{0,18}[0-9a-z])?$/i.test(driver)) {
    throw new TypeError('ドライバの指定が正しくありません');
  }
  var Driver = require(path.join(__dirname, 'drivers', driver));
  this.driver = new Driver(schema.store);

  /**
   * BLOB
   * @property {BlobDriver} blobDriver
   */
  var blob = schema.blob || defaultBlob;
  if (!is(String, blob) || !/^[a-z]([_0-9a-z]{0,18}[0-9a-z])?$/i.test(blob)) {
    throw new TypeError('ドライバの指定が正しくありません');
  }
  var BlobDriver = require(path.join(__dirname, 'blob-drivers', blob));
  this.blobDriver = new BlobDriver(schema.blobStore, this.driver);


  /**
   * 読取専用
   * @property {Boolean} readonly
   */
  this.readonly = schema.readonly === true;

  /**
   * スキーマ変更
   *  (読取専用時は必ずfalseに設定されます)
   * @property {Boolean} modifySchema
   */
  this.modifySchema = !this.readonly && schema.modifySchema === true;

  /**
   * mapReduceが実行可能か
   * @property {Boolean} enableMapReduce
   */
  this.enableMapReduce = schema.enableMapReduce === true && this.driver.mapReduce;

  /**
   * SQLが実行可能か
   * @property {Boolean} enableSql
   */
  this.enableSql = schema.enableSql === true && this.driver.sql;

};

/**
 * テーブル構成を取得する
 * @method getSchema
 * @param  {String}   table
 * @param  {Function} callback ({Error} err, {Object} schema)
 * @return メソッドチェーン
 */
Database.prototype.getSchema = function getSchema (table, callback) {
  'use strict';
  if (!is.matches([String, Function], arguments)) {
    throw new TypeError('引数は{String} table,' +
        ' {Function} callbackである必要があります');
  }

  this.driver.getSchema(table, callback);

  return this;
};

/**
 * テーブルを作成する
 * @method createTable
 * @param  {String}    table
 * @param  {Object}    schema
 * @param  {Function}  callback ({Error} err, {Boolean} success)
 * @return メソッドチェーン
 */
Database.prototype.createTable = function createTable (table, schema, callback) {
  'use strict';
  if (!is.matches([String, Object, Function], arguments, [0, 1])) {
    throw new TypeError('引数は{String} table,' +
        ' {Object} schema,{Function} callbackである必要があります');
  }

  if (this.modifySchema) {
    this.driver.createTable(table, schema, callback);

  } else {
    if(callback) {
      callback(new Error('テーブル作成の権限がありません'), false);
    }

  }
  return this;
};

/**
 * テーブルを変更する
 * @method alterTable
 * @param  {String}   table
 * @param  {Object}   schema
 * @param  {Function} callback ({Error} err, {Boolean} success)
 * @return メソッドチェーン
 */
Database.prototype.alterTable = function alterTable (table, schema, callback) {
  'use strict';
  if (!is.matches([String, Object, Function], arguments, [0, 1])) {
    throw new TypeError('引数は{String} table,' +
        ' {Object} schema,{Function} callbackである必要があります');
  }

  if (this.modifySchema) {
    this.driver.alterTable(table, schema, callback);

  } else {
    if (callback) {
      callback(new Error('テーブル変更の権限がありません'), false);
    }

  }
  return this;
};

/**
 * テーブルを削除する
 * @method dropTable
 * @param {String}   table
 * @param {Function} callback ({Error} err, {Boolean} success)
 * @return メソッドチェーン
 */
Database.prototype.dropTable = function dropTable (table, callback) {
  'use strict';

  // 引数チェック
  if (!is(String, table)) {
    throw new Error(
      '引数は{String} table, {Function} callbackである必要があります');
  }

  if (this.modifySchema) {
    if (is(Function, callback)) {
      callback(new Error('テーブル削除の権限がありません'), false);
    }

  } else {
    this.driver.dropTable(table, callback);

  }

  return this;
};

/**
 * インデックスの追加
 * @method addIndex
 * @param  {String}   table
 * @param  {Array}    fields
 * @param  {String|Object} options 省略可能
 * @param  {Function} callback ({Error} err, {Boolean} success) 省略可能
 * @return メソッドチェーン
 */
Database.prototype.addIndex = function addIndex (table, fields, options, callback) {
  'use strict';

  if (is(Function, options)) {
    callback = options;
  }

  if (!is(Object, options)){
    options = {};
  }

  if (this.modifySchema) {
    if (is(Function, callback)) {
      callback(new Error('読取専用です'), false);
    }

  } else {
    this.driver.addIndex(table, fields, options, callback);

  }

  return this;
};

/**
 * インデックスの削除
 * @method  removeIndex
 * @param  {String}   table
 * @param  {Array}    fields
 * @param  {Function} callback ({Error} err, {Boolean} success)
 * @return メソッドチェーン
 */
Database.prototype.removeIndex = function removeIndex (table, fields, callback) {
  'use strict';
  if (this.modifySchema) {
    if (is(Function, callback)) {
      callback(new Error('読取専用です'), false);
    }

  } else {
    this.driver.removeIndex(table, fields, callback);

  }

  return this;
};

/**
 * 行IDを作成
 * @method createId
 * @param  {String}   table (省略時null)
 * @param  {Function} callback ({Error} err, {String} id)
 * @return メソッドチェーン
 */
Database.prototype.createId = function createId (table, callback) {
  'use strict';

  if (is(Function, table)) {
    callback = table;
    table = null;
  }

  if (this.readonly) {
    callback(new Error('読取専用です'), null);

  } else {
    this.driver.createId(table, callback);

  }
  return this;
};

/**
 * 取得
 * tableとcallback以外は省略する事ができます
 * @method find
 * @param  {String}   table
 * @param  {Object}   selector (省略可能)
 *             nullを設定した場合は全レコードが対象になります
 * @param  {Array}    fields (省略可能)
 *             nullを設定した場合は全フィールドを設定します
 * @param  {Object}   options  (省略可能)
 *             ドライバ毎に設定出来るオプションが存在します
 *             以下は共通のオプションで、ドライバよってサポート状況が異なります
 *             sort  : 取得順     {String|Array}   ex) [[fieldName, 1 or -1]]
 *                                      文字列の場合は
 *             skip  : 開始行番号 {Number}  0から開始します
 *             limit : 表示行数   {Number}  指定なしで全件
 *             scalar: スカラー   {String}  一つのフィールド名を指定します
 *                                      fieldsの値は無視されます
 *                                      skip, limitは無視します
 *                                      最初の一件の指定したフィールドの値のみ返します
 *                                      取得出来ない場合はnullを返します
 *             single: １件取得   {Boolean} 一件の結果のみ返します
 *                                      skip, limitは無視します
 *                                      結果は配列ではなくオブジェクトで返します
 *                                      取得出来ない場合はnullを返します
 *                                      scalarが設定されている場合は無視されます
 * @param  {Function} callback ({Error} err, {Mixed} result)
 * @return メソッドチェーン
 */
Database.prototype.find =
  function find (table, selector, fields, options, callback) {
  'use strict';

  switch(true) {

  // table, selector, fields, options, callback
  case is.matches([String, Object, Array, Object, Function], arguments, [0, 4]):
    break;

  // table, selector, fields, callback
  case is.matches([String, Object, Array, Function], arguments, [0, 3]):
    callback = options;
    options  = null;
    break;

  // table, selector, options, callback
  case is.matches([String, Object, Object, Function], arguments, [0, 3]):
    callback = options;
    options  = fields;
    fields   = null;
    break;

  // table, selector, callback
  case is.matches([String, Object, Function], arguments, [0, 2]):
    callback = fields;
    options  = null;
    fields   = null;
    break;

  // table, fields, callback
  case is.matches([String, Array, Function], arguments, [0, 2]):
    callback = fields;
    options  = null;
    fields   = selector;
    selector = null;
    break;

  // table, callback
  case is.matches([String, Function], arguments):
    callback = selector;
    options  = null;
    fields   = null;
    selector = null;
    break;

  default:
    throw new TypeError(
      '引数は{String} table, {Object} selector, {Array} fields,' +
      ' {Object} options, {Function} callbackである必要があります');

  }

  this.driver.find(table, selector, fields, options, callback);
};

/**
 * 追加
 * @method add
 * @param {String}   table
 * @param {Object}   data
 * @param {Object}   options
 *             省略可能
 *             オプションはドライバよって異なります
 *             共通のオプションはありません
 * @param {Function} callback ({Error} err)
 *            省略可能
 * @param {Boolean} skipMatch 
 *            引数チェックをスキップします。明示的に設定しないでください
 * @return メソッドチェーン
 */
Database.prototype.add =
  function add (table, data, options, callback) {
  'use strict';

  switch(true) {

  // table, data, options, callback
  case is.matches([String, Object, Object, Function], arguments, [0, 1]):
    break;

  // table, data, callback
  case is.matches([String, Object, Function], arguments, [0, 1]):
    callback = options;
    options  = null;
    break;

  default:
    throw new Error(
      '引数は{String} table, {Object} data, {Object} options' +
      '{Function} callbackである必要があります');
  }

  if (!this.driver) {
    if (is(Function, callback)) {
      callback(new Error('データベースに接続出来ません'), null);
    }

  } else if (!this.driver.add) {
    if (is(Function, callback)) {
      callback(new Error('追加が出来ないデータベース接続です'), null);
    }

  } else if (this.readonly) {
    if (is(Function, callback)) {
      callback(new Error('読取専用です'), null);
    }

  } else {
    this.driver.add(table, data, options, callback);

  }

  return this;
};

/**
 * 更新
 * @method update
 * @param {String}   table
 * @param {Object}   selector
 * @param {Object}   data
 * @param {Object}   options
 *             省略可能
 *             オプションはドライバよって異なります
 *             以下は共通のオプションです。既定値はすべてfalseです
 *             single : 一件更新 {Boolean} 条件に一致した最初の一件のみ更新します
 *                                         RDBは対応していないものが多くあります
 *             upsert : 代替追加 {Boolean} 条件に一致したものが一件も無い場合は
 *                                         更新の代わりに追加します
 *             replace: 置換     {Boolean} すべてのフィールドを置き換える
 *             
 * @param {Function} callback ({Error} err)
 * @param {Boolean}  skipMatch 
 *             引数チェックをスキップします。明示的に設定しないでください
 *             model時にステップ数を減らす為に用意された特別なフラグです
 * @return メソッドチェーン
 */
Database.prototype.update =
  function update (table, selector, data, options, callback, skipMatch) {
  'use strict';

  switch(true) {
  
  // 引数チェックスキップ
  case skipMatch:
    break;

  // table, selector, data, options, callback
  case is.matches([String, Object, Object, Object, Function], arguments, [0, 2]):
    break;

  // table, selector, data, callback
  case is.matches([String, Object, Object, Function], arguments, [0, 2]):
    callback = options;
    options  = null;
    break;

  // table, data, callback
  case is.matches([String, Object, Function], arguments, [0, 1]):
    callback = data;
    data     = selector;
    selector = null;
    break;

  default:
    throw new TypeError(
      '引数は{String} table, {Object} selector, {Object} data' +
      ' {Object} options, {Function} callbackである必要があります');

  }

  if (!this.driver) {
    if (is(Function, callback)) {
      callback(new Error('データベースに接続出来ません'), null);
    }

  } else if (!this.driver.update) {
    if (is(Function, callback)) {
      callback(new Error('更新が出来ないデータベース接続です'), null);
    }

  } else if (this.readonly) {
    if (is(Function, callback)) {
      callback(new Error('読取専用です'));
    }

  } else {
    this.driver.update(table, selector, data, options, callback);

  }
};

/**
 * 削除
 * @method remove
 * @param  {String}   table
 * @param  {Object}   selector
 * @param  {Object}   options
 *             省略可能
 *             オプションはドライバよって異なります
 *             以下は共通のオプションです。既定値はすべてfalseです
 *               single: 一件削除 {Boolean} 最初に一致した一行のみを削除します
 * @param  {Function} callback ({Error} err)
 * @return メソッドチェーン
 */
Database.prototype.remove =
  function removeOne (table, selector, options, callback) {
  'use strict';
  switch(true) {

  // table, selector, options, callback
  case is.matches([String, Object, Object, Function], arguments, [0]):
    break;

  // table, selector, callback
  case is.matches([String, Object, Function], arguments, [0]):
    callback = options;
    options  = null;
    break;

  // table, callback
  case is.matches([String, Function], arguments, [0]):
    callback = selector;
    options  = null;
    selector = null;
    break;

  default:
    throw new TypeError(
      '引数は{String} table, {Object} selector, ' +
      '{Object} options, {Function} callbackである必要があります');

  }

  if (this.readonly) {
    if (is(Function, callback)) {
      callback(new Error('読取専用です'));
    }

  } else {
    this.driver.remove(table, selector, options, callback);

  }

  return this;
};

/**
 * map-reduceによる集計
 * 対応していないドライバでは例外が発生します
 * @method mapReduce
 * @param  {String}   table
 * @param  {Function} map
 * @param  {Function} reduce
 * @param  {Function} callback ({Error} err, {Mixed} result)
 * @return メソッドチェーン
 */
Database.prototype.mapReduce = function mapReduce (table, map, reduce, callback) {
  'use strict';
  if (this.enableMapReduce) {
    this.driver.mapReduce(table, map, reduce, callback);

  } else {
    callback(new Error('mapReduceを実行する事が出来ません'), null);

  }

  return this;
};

/**
 * SQLクエリ発行
 * 対応はしていないドライバでは例外が発生します
 * @method sql
 * @param  {String}   query
 * @param  {Function} callback ({Error} err, {Mixed} result)
 * @return メソッドチェーン
 */
Database.prototype.sql = function sql (query, callback) {
  'use strict';
  if (this.enableSql) {
    this.driver.sql(query, callback);

  } else {
    callback(new Error('sqlを実行する事ができません'), null);

  }

  return this;
};

/*
 * BLOBを検索する
 * @method findBlob
 * @param  {Object}   selector
 *     BLOB情報の絞り込みを行います
 *       id        : BlobID       {String}
 *       table     : テーブル名   {String}
 *       field     : フィールド名 {String}
 *       row       : 行ID         {String}
 *       name      : BLOB名       {String}
 *       mime      : MIME         {String}
 *       extname   : 拡張子       {String}
 *       size      : サイズ       {Number} byte単位
 *       modified  : 最終更新日時 {String|Array}
 *                       ex) ['2012-01-01', '2012-01-31']
 *                       時刻を省略した場合は、終日が対象になります
 * @param  {Object}   options
 *       sort      : 取得順   {Array}   ex [['name', 1]]
 *       skip      : 開始件数 {Number}  0から開始します
 *       limit     : 取得件数 {Number}  指定無しで全件
 *       single    : 1件取得  {Boolean} 1件のみ結果を返します
 *                                      skip, limitは無視します
 * @param  {Function} callback ({Error} err, {Array} results)
 *                      結果オブジェクトを配列にしてして返します
 * @return メソッドチェーン
 */
Database.prototype.findBlob =
  function findBlob (selector, options, callback) {
  'use strict';

  switch(true) {

  // selector, options, callback
  case is.matches([Object, Object, Function], arguments, [0, 2]):
    break;

  // selector, callback
  case is.matches([Object, Function], arguments):
    callback = options;
    options  = null;
    break;

  default:
    throw new TypeError(
      '引数は{Object} selector, {Object} options,' +
        ' {Function} callbackである必要があります');
  }

  // 最終更新日時を範囲に変更する
  if (selector && selector.modified) {
    selector.modified = term (selector.modified);
  }

  this.blob.find(selector, options, callback);

  return this;
};

// BLOB追加
Database.prototype.addBlob =
  function addBlob (table, id, field, file, callback) {
  'use strict';
  callback(new Error('TODO'), null);
  return this;

};

// BLOB削除
Database.prototype.removeBlob = function removeBlob (id, callback) {
  'use strict';
  callback(new Error('TODO'), null);
  return this;
};

module.exports = exports = Database;
