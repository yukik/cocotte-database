'use strict';

/**
 * dependencies
 */
var is = require('cocotte-is');
var msg = require('cocotte-message');

/** 
 * alias
 */
var debug = msg.debug('cocotte-database');
var defaultDriver = 'cocotte-database-mongodb';
var regDriver = /^[a-z]([-_0-9a-z]{0,18}[0-9a-z])?$/i;


var Database = function Database (schema) {
  debug();

  // 変数チェック
  schema = is.alt(Object, schema, {});

  /**
   * ドライバ
   * @property {Driver} driver
   */
  var driver = schema.driver || defaultDriver;
  if (!is(String, driver) || !regDriver.test(driver)) {
    throw new TypeError('ドライバの指定が正しくありません');
  }
  var Driver = require(driver);
  this.driver = new Driver(schema.store);

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
};

/**
 * テーブル一覧の取得が実行可能かどうか
 * @property enableGetTables
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableGetTables', {
  enumerable: true,
  get: function () {
    return typeof this.db.getTables === 'function';
  }
});

/**
 * テーブル一覧を取得
 * @method  getTables
 * @return {Thunk.<Array.String>} tableNames
 */
Database.prototype.getTables = function getTables () {
  debug();
  if (!this.enableGetTables) {
    throw new Error('テーブル一覧を取得出来ません');
  }
  return this.db.getTables();
};

/**
 * テーブル作成が実行可能かどうか
 * @property enableGetTables
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableCreateTable', {
  enumerable: true,
  get: function () {
    return this.modifySchema && typeof this.db.createTable === 'function';
  }
});

/**
 * テーブル作成
 * @method createTable
 * @param  {Srting} table
 * @param  {Object} fields
 * @return {Thunk.<Boolean>} success
 */
Database.prototype.createTable = function createTable (table, fields) {
  debug();
  if (!this.enableCreateTable) {
    throw new Error('テーブルを作成する事は出来ません');
  }
  return this.db.createTable(table, fields);
};

/**
 * テーブルの削除が実行可能かどうか
 * @property enableDropTable
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableDropTable', {
  enumerable: true,
  get: function () {
    return this.modifySchema && typeof this.db.dropTable === 'function';
  }
});

/**
 * テーブルの削除
 * @method dropTable
 * @param  {Srting} table
 * @return {Thunk.<Boolean>} success
 */
Database.prototype.dropTable = function dropTable (table) {
  debug();
  if (!this.enableDropTable) {
    throw new Error('テーブルを削除する事は出来ません');
  }
  return this.db.dropTable(table);
};

/**
 * フィールド一覧の取得が実行可能かどうか
 * @property enableGetFields
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableGetFields', {
  enumerable: true,
  get: function () {
    return typeof this.db.getFields === 'function';
  }
});

/**
 * フィールド一覧を取得
 * @method getFields
 * @param  {Srting}   table
 * @return {Thunk.<Object>} fields
 */
Database.prototype.getFields = function getFields (table) {
  debug();
  if (!this.enableGetFields) {
    throw new Error('テーブルを作成する事は出来ません');
  }
  return this.db.getFields(table);
};

/**
 * フィールドの追加が実行可能かどうか
 * @property enableAddField
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableAddField', {
  enumerable: true,
  get: function () {
    return this.modifySchema && typeof this.db.addField === 'function';
  }
});

/**
 * フィールドの追加
 * @method addField
 * @param  {Srting} table
 * @param  {String} field
 * @param  {Object} schema
 * @return {Thunk.<Boolean>} success
 */
Database.prototype.addField = function addField (table, field, schema) {
  debug();
  if (!this.enableAddField) {
    throw new Error('フィールドを追加する事は出来ません');
  }
  return this.db.addField(table, field, schema);
};

/**
 * フィールドの変更が実行可能かどうか
 * @property enableAlterField
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableAlterField', {
  enumerable: true,
  get: function () {
    return this.modifySchema && typeof this.db.alterField === 'function';
  }
});

/**
 * フィールドの変更
 * @method alterField
 * @param  {Srting} table
 * @param  {String} field
 * @param  {Object} schema
 * @return {Thunk.<Boolean>} success
 */
Database.prototype.alterField = function alterField (table, field, schema) {
  debug();
  if (!this.enableAlterField) {
    throw new Error('フィールドを変更する事は出来ません');
  }
  return this.db.alterField(table, field, schema);
};

/**
 * フィールド削除が実行可能かどうか
 * @property enableRemoveField
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableRemoveField', {
  enumerable: true,
  get: function () {
    return this.modifySchema && typeof this.db.removeField === 'function';
  }
});

/**
 * フィールドの削除
 * @method removeField
 * @param  {Srting} table
 * @param  {String} field
 * @return {Thunk.<Boolean>} success
 */
Database.prototype.removeField = function removeField (table, field) {
  debug();
  if (!this.enableRemoveField) {
    throw new Error('フィールドの削除する事は出来ません');
  }
  return this.db.removeField(table, field);
};


/**
 * インデックス一覧の取得が実行可能かどうか
 * @property enableGetIndexes
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableGetIndexes', {
  enumerable: true,
  get: function () {
    return this.modifySchema && typeof this.db.getIndexes === 'function';
  }
});

/**
 * インデックス一覧の取得
 * @method getIndexes
 * @param  {Srting}    table
 * @return {Thunk.<Boolean>} success
 */
Database.prototype.getIndexes = function getIndexes (table) {
  debug();
  if (!this.enableGetIndexes) {
    throw new Error('インデックス一覧の取得をする事は出来ません');
  }
  return this.db.getIndexes(table);
};

/**
 * インデックスの追加が実行可能か
 * @property enableAddIndex
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableAddIndex', {
  enumerable: true,
  get: function () {
    return this.modifySchema && typeof this.db.addIndex === 'function';
  }
});

/**
 * インデックスの追加
 * @method addIndex
 * @param  {Srting}    table
 * @param  {String|Array} index
 * @param  {Object} options
 *           {Boolean} unique
 * @return {Thunk.<Boolean>} success
 */
Database.prototype.addIndex = function addIndex (table, index, options) {
  debug();
  if (!this.enableAddIndex) {
    throw new Error('インデックスを追加する事は出来ません');
  }
  return this.db.addIndex(table, index, options);
};

/**
 * インデックスの削除が実行可能か
 * @property enableRemoveIndex
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableRemoveIndex', {
  enumerable: true,
  get: function () {
    return this.modifySchema && typeof this.db.xxx === 'function';
  }
});

/**
 * インデックスの削除
 * @method removeIndex
 * @param  {Srting}       table
 * @param  {String|Array} index
 * @return {Thunk.<Boolean>} success
 */
Database.prototype.removeIndex = function removeIndex (table, index) {
  debug();
  if (!this.enableRemoveIndex) {
    throw new Error('インデックスを削除する事は出来ません');
  }
  return this.db.removeIndex(table, index);
};

/**
 * 新規の行IDの取得が実行可能か
 * @property enableCreateId
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableCreateId', {
  enumerable: true,
  get: function () {
    return !this.readonly && typeof this.db.createId === 'function';
  }
});

/**
 * 新規の行IDの取得
 * @method createId
 * @param  {Srting}    table
 * @return {Thunk.<String>} rowId
 */
Database.prototype.createId = function createId (table) {
  debug();
  if (!this.enableCreateId) {
    throw new Error('新規行のIDを取得する事は出来ません');
  }
  return this.db.createId(table);
};

/**
 * 複数行を取得
 * @method find
 * @param  {Srting}       table
 * @param  {Object}       selector
 * @param  {String|Array} fields
 * @param  {Object}       options
 *           {String|Array} sort
 *           {Number}       skip
 *           {Number}       limit
 * @return {Thunk.<Array.Object>} rows
 */
Database.prototype.find = function find (table, selector, fields, options) {
  debug();
  return this.db.find(table, selector, fields, options);
};
  
/**
 * 単行の取得
 * @method getRow
 * @param  {String}        table
 * @param  {String|Object} selector
 * @param  {Array}         fields
 * @param  {Object}        options
 *           {String|Array}  sort
 *           {Number}        skip
 * @return {Thunk.<Object>} row
 */
Database.prototype.XXX = function getRow (table, selector, fields, options) {
  debug();
  return this.db.getRow(table, selector, fields, options);
};

/**
 * 値の取得
 * selectorに文字列を指定した場合は、行番号を指定したと見なします
 * @method getValue
 * @param  {String}         table
 * @param  {String|Object}  selector
 * @param  {String}         field
 * @param  {Object}         options
 *           {String|Array}   sort
 *           {Number}         skip
 * @return {Thunk.<Mixed>} value
 */
Database.prototype.getValue = function getValue (table, selector, field, options) {
  debug();
  return this.db.getValue(table, selector, field, options);
};

/**
 * 行の保存が実行可能か
 * @property enableSave
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableSave', {
  enumerable: true,
  get: function () {
    return !this.readonly && typeof this.db.save === 'function';
  }
});

/**
 * 行の保存
 * @method save
 * @param  {Srting}    table
 * @param  {Object}    row
 * @return {Thunk.<Boolean>} success
 */
Database.prototype.save = function save (table, row) {
  debug();
  if (!this.enableSave) {
    throw new Error('行を保存する事は出来ません');
  }
  return this.db.save(table, row);
};

/**
 * 行の追加が実行可能かどうか
 * @property enableAdd
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableAdd', {
  enumerable: true,
  get: function () {
    return !this.readonly && typeof this.db.add === 'function';
  }
});

/**
 * 行の追加
 *
 * saveと異なりrowにrowIdを含んではいけません
 * 
 * @method add
 * @param  {Srting} table
 * @param  {Object} row
 * @return {Thunk.<Boolean>} success
 */
Database.prototype.add = function add (table, row) {
  debug();
  if (!this.enableAdd) {
    throw new Error('行を追加する事は出来ません');
  }
  return this.db.add(table, row);
};

/**
 * 行の変更が実行可能かどうか
 * @property enableUpdate
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableUpdate', {
  enumerable: true,
  get: function () {
    return !this.readonly && typeof this.db.update === 'function';
  }
});

/**
 * 行の更新
 * @method update
 * @param  {Srting} table
 * @param  {Object} delector
 * @param  {Object} data
 * @return {Thunk.<Number>} effectRowCount
 */
Database.prototype.update = function update (table, selector, data) {
  debug();
  if (!this.enableUpdate) {
    throw new Error('行を更新する事は出来ません');
  }
  return this.db.update(table, selector, data);
};

/**
 * 行の削除が実行可能かどうか
 * @property enableRemove
 * @return {Boolean}
 */
Object.setProperty(Database.prototype, 'enableRemove', {
  enumerable: true,
  get: function () {
    return !this.readonly && typeof this.db.remove === 'function';
  }
});

/**
 * 行の削除
 * @method remove
 * @param  {Srting}    table
 * @param  {String|Object} selector
 * @return {Thunk.<Number>} effectRowCount
 */
Database.prototype.remove = function remove (table, selector) {
  debug();
  if (!this.enableRemove) {
    throw new Error('行を削除する事は出来ません');
  }
  return this.db.remove(table, selector);
};

module.exports = exports = Database;