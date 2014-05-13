/*
 * cocotte-database
 * Copyright(c) 2013 Yuki Kurata <yuki.kurata@gmail.com>
 * MIT Licensed
 */

'use strict';

/**
 * dependencies
 */
var is = require('cocotte-is');
var path = require('path');
var msg = require('cocotte-message');

/**
 * alias
 */
var debug = msg.debug('cocotte-database');
var regSchema = /^[a-z]([-_0-9a-z]{0,18}[0-9a-z])?$/i;

/**
 * Database
 */
var Database = require('./lib/klass');

/**
 * 定義ファイル保存先
 * @property {String} schemaPath
 * @static
 */
Database.schemaPath = path.join(path.dirname(process.argv[1]), 'databases');

/**
 * インスタンス
 * @property {Object} instances
 * @static
 */
Database.instances = {};

/** 
 * データベース接続を作成し登録します
 * 
 * 作成された接続はDatabase.instancesで管理されます
 * 一時的な場合は、new Database(schema)で作成してください
 * 
 * @method set
 * @static
 * @param  {String}   name
 * @param  {String|Object}   schema
 * @return {Database} データベース
 */
Database.set = function set (name, schema) {
  debug();

  if (Database.instances[name]) {
    throw new Error('既に登録されています');
  }

  schema = schema || name;

  if (typeof schema === 'string') {
    if (regSchema.test(schema)) {
      schema = require(path.join(Database.schemaPath, schema));

    } else {
      throw new Error('定義名が正しくありません');
    }
  }

  if (!is(Object, schema)) {
    throw new Error('schemaが正しくありません');

  }

  var db = new Database(schema);
  Database.instances[name] = db;

  return db;
};

/**
 * 登録済みデータベースを取得する
 * 
 * @method get
 * @param  {String} name
 * @return {Database} db
 */
Database.get = function get (name) {
  debug();

  // 引数確認
  if (!is(String, name) || !regSchema.test(name)) {
    throw new Error('nameは文字列を設定してください');
  }

  // 作成済みインスタンス
  var db = Database.instances[name];

  // 定義済みから取得
  return db || Database.set(name, name);
};

module.exports = exports = Database;