'use strict';

/*
 * dependencies
 */
var cis = require('cocotte-is');
var MongoDB = require('mongodb');
var co = require('co');
var MongoClient = MongoDB.MongoClient;
var ObjectID = MongoDB.ObjectID;

/**
 * インスタンスの生成
 * 
 * 直接使用する事は稀で、Databaseインスタンスのhas-a
 * database.get(databaseName)で取得されるデータベース接続が内部から操作される
 * 
 * @class Database.drivers.Mongo
 * @constructor
 * @param  {Object} schema 
 *      host: {String} 接続先
 *      port: {Number} ポート番号
 *      db  : {String} データベース名
 *      pool: {Number} コネクションプールの上限 
 */
var Mongo = function Mongo (schema) {
  if (!cis(Object, schema)) {
    schema = {};
  }

  /**
   * ホスト
   * @property {String} host
   * @default 127.0.0.1
   */
  this.host = cis(String, schema.host) ? schema.host : '127.0.0.1';

  /**
   * ポート
   * @property {Number} port
   * @default  27017
   */
  this.port = cis(Number, schema.port) ? schema.port : 27017;

  /**
   * 接続先データベース
   * @property {String} db
   * @default  cocotte
   */
  this.db = cis(String, schema.db) ? schema.db : 'cocotte';

  /**
   * コネクションプールの上限
   * @property {Number} pool
   * @default 1
   */
  this.pool = cis(Number, schema.pool) ? schema.pool : 1;

  /**
   * 接続文字列
   * @property {String} connectionString
   */
  this.connectionString = 'mongodb://' + this.host + ':' + this.port + '/' +
              this.db + '?maxPoolSize=' + this.pool;

  /**
   * 行ID名
   * @property {String} idName
   */
  this.idName = '_id';
};

/**
 * テーブル構成を取得する
 * @method getSchema
 * @param  {String}   table
 * @return {Thunkify Function}
 */
Mongo.prototype.getSchema = function getSchema (table) {
  table = null;
  return function (callback) {
    callback(new Error('mongodbは構成を取得する事はできません'), null);
  };
};

/**
 * テーブルの作成
 * @method createTable
 * @param  {Srting}    table
 * @param  {Object}    schema
 * @return {Thunkify Function}
 */
Mongo.prototype.createTable = function createTable (table, schema) {
  table = null;
  schema = null;
  return function (callback) {
    /*
     * Mongodbは明示的にテーブルを作成しなくとも良いのでテーブルの作成処理はありません
     * 常に成功を返します
     */
    callback(null, true);
  };
};

/**
 * テーブルの変更
 * @method alterTable
 * @param  {Srting}    table
 * @param  {Object}    schema
 * @return {Thunlify Function}
 */
Mongo.prototype.alterTable = function alterTable (table, schema) {
  table = null;
  schema = null;
  return function (callback) {
    /**
     * Mongodbは明示的にテーブルを変更しなくとも良いのでテーブルの変更処理はありません
     * 常に成功を返します
     */
    callback(null, true);
  };
};

/**
 * テーブルの削除
 * @method dropTable
 * @param  {String}   table
 * @param  {Function} callback ({Error} err, {Boolean} success)
 * @return メソッドチェーン
 */
Mongo.prototype.dropTable = function dropTable (table, callback) {
  try {
    MongoClient.connect(this.connectionString, function(err, db) {
      if (err) {
        if (callback) {
          callback(err, false);
        }
      } else {
        db.dropCollection(table
        , function (err) {
          db.close();
          if (callback) {
            callback(err, !err);
          }
        });
      }
    });
  } catch (err) {
    if (callback) {
      callback(err, false);
    }
  }
  return this;
};

// インデックスを{key: asc, ...}に変更
var indexesParse = function indexesParse (fields) {
  var indexes = {};
  if (cis(String, fields)) {
    indexes[fields] = 1;
  } else if (cis(Array, fields)) {
    fields.forEach(function(f) {
      if (cis(String, f)) {
        indexes[f] = 1;
      } else if (cis(Array, f) && cis(String, f[0])) {
        indexes[f[0]] = f[1] === -1 || f[1] === false || f[1] === 'desc' ? -1 : 1;
      }
    });
  } else {
    throw new Error('インデックスの設定が正しくありません');
  }
  return indexes;
};

/**
 * インデックスの追加
 * @method  addIndex
 * @param  {String}   table
 * @param  {Array}    fields
 * @param  {Object}   options
 * @param  {Function} callback ({Error} err)
 * @return メソッドチェーン
 */
Mongo.prototype.addIndex = function addIndex (table, fields, options, callback) {
  try {
    MongoClient.connect(this.connectionString, function(err, db) {
      if (err) {
        if (callback) {
          callback(err, false);
        }
      } else {

        // インデックス
        var indexes = indexesParse(fields);

        // オプション
        var op = {background: true};
        if (options.unique) {
          op.unique = true;
        }

        db.collection(table).ensureIndex(indexes, op, function(err) {
          if (callback) {
            callback(err, !err);
          }
        });
      }
    });

  } catch (e) {
    if (callback) {
      callback(e, false);
    }
  }
  return this;
};

/**
 * インデックスの削除
 *
 * @method removeIndex
 * @param  {String}  table
 * @param  {Array}   fields
 * @param  {Function} callback ({Error} err, {Boolean} success)
 * @return メソッドチェーン
 */
Mongo.prototype.removeIndex = function removeIndex (table, fields, callback) {
  try {
    MongoClient.connect(this.connectionString, function(err, db) {
      if (err) {
        if (callback) {
          callback(err, false);
        }
      } else {

        // インデックス
        var indexes = indexesParse(fields);

        db.collection(table).dropIndex(indexes, function(err) {
          if (callback) {
            callback(err, !err);
          }
        });
      }
    });

  } catch (e) {
    if (callback) {
      callback(e, false);
    }
  }
  return this;
};

/**
 * 行を特定するIDを作成
 * @method createId
 * @param  {String}   table
 * @param  {Function} callback ({Error} err, {String} id)
 * @return メソッドチェーン
 */
Mongo.prototype.createId = function createId (table, callback) {

  try {
    callback(null, new ObjectID());
  } catch (e) {
    callback(e, null);
  }

  return this;
};

/**
 * 取得
 * @method find
 * @param  {String}   table
 * @param  {Object}   selector
 * @param  {Array}    fields
 * @param  {Object}   options
 *           共通オプション。説明はdatabase-protoを参照
 *             sort  : 表示順     {Array}   サポート
 *             skip  : 開始行番号 {Number}  サポート
 *             limit : 表示行数   {Number}  サポート
 *             single: １件取得   {Boolean} サポート
 *             scalar: スカラー   {String}  サポート
 *           個別オプション
 *             なし
 * @param  {Function} callback ({Error} err, {Mixed} result)
 * @return メソッドチェーン
 */
Mongo.prototype.find =
  function find (table, selector, fields, options, callback) {
  options = options || {};

  var type =  options.scalar ? 'scalar':
        options.single ? 'single':
        'multi'
    , op   =  {};

  // fields
  if (type === 'scalar') {
    op.fields = {};
    op.fields[options.scalar] = 1;

  } else if (cis(Array, fields)) {
    op.fields = {};
    fields.forEach(function (field) {
      op.fields[field] = 1;
    });
  }

  // sort
  if (options.sort) {
    op.sort = [];
    if (cis(String, options.sort)) {
      op.push([options.sort, 1]);

    } else if (cis(Array, options.sort)) {
      options.sort.forEach(function(f){
        if (cis(Array, f)) {
          var asc = f[1] === -1 || f[1] === false || f[1] === 'desc' ? -1 : 1;
          options.push([f[0], asc]);
        } else if (cis(String, f)) {
          op.push([f, 1]);
        }
      });
    }
    op.sort = options.sort;
  }

  // top limit
  switch(type) {
  case 'multi':
    if (options.skip) {
      op.skip  = options.skip;
    }
    if (options.limit) {
      op.limit = options.limit;
    }
    break;
  case 'single':
  case 'scalar':
    break;
  }

  try {
    MongoClient.connect(this.connectionString, function(err, db) {
      if (err) {
        callback(err, null);
      } else {
        switch (type) {

        // 複数行
        case 'multi':
          //取得
          db.collection(table).find(selector, op
            , function(err, results){
              if (err) {
                db.close();
                callback(err, null);
              } else {
                results.toArray(function(err, docs) {
                  db.close();
                  callback(err, docs);
                });
              }
            }
          );
          break;

        // 一行
        case 'single':
          db.collection(table).findOne(selector, op
              , function (err, doc) {
                db.close();
                callback(err, doc);
              }
            );
          break;

        // 単値
        case 'scalar':
          var field = options.scalar;
          db.collection(table).findOne(selector, op
              , function (err, doc) {
                db.close();
                var val = null;
                if (doc) {
                  val = doc[field];
                }
                callback(err, val);
              }
            );
          break;
        }
      }
    });
  } catch (err) {
    if (callback) {
      callback(err, null);
    }
  }
  return this;
};

/**
 * 行の追加
 * @method add
 * @param {String}   table
 * @param {Object}   data
 * @param {Object}   options
 * @param {Function} callback ({Error} err, {Boolean} success)
 * @return メソッドチェーン
 */
Mongo.prototype.add = function add (table, data, options, callback) {

  var op = {w: 1};
  if (options) {
    // 有効なオプションはありません
  }

  try {
    MongoClient.connect(this.connectionString, function(err, db) {
      if (err) {
        if (callback) {
          callback(err, false);
        }
      } else {
        db.collection(table).insert(data, op
          , function(err) {
            db.close();
            if (callback) {
              callback(err, true);
            }
          }
        );
      }
    });
  } catch (err) {
    if (callback) {
      callback(err, false);
    }
  }
  return this;
};

/**
 * 行の更新
 * @method  update
 * @param {String}   table
 * @param {Object}   selector
 * @param {Object}   data
 * @param {Object}   options
 *           共通オプション。説明はdatabase-protoを参照
 *           single : 一件更新 {Boolean} 既定値 false
 *           upsert : 代替追加 {Boolean} 既定値 false
 *           replace: 置換     {Boolean} 既定値 false
 * @param {Function} callback ({Error} err, {Boolean} success)
 * @return メソッドチェーン
 */
Mongo.prototype.update =
  function update (table, selector, data, options, callback) {
  options = options || {};
  var op = {w: 1};
  if (!options.single) {
    op.multi = true;
  }
  if (options.upsert) {
    op.upsert = true;
  }
  if (options.replace !== true) {
    data = {$set: data};
  }
  try {
    MongoClient.connect(this.connectionString, function(err, db) {
      if (err) {
        if (callback) {
          callback(err);
        }
      } else {
        db.collection(table).update(
          selector || {}
          , data
          , op
          , function (err) {
            db.close();
            if (callback) {
              callback(err, true);
            }
          }
        );
      }
    });
  } catch (err) {
    if (callback) {
      callback(err);
    }
  }
};

/**
 * 行の削除
 * @method remove
 * @param {String}   table
 * @param {Object}   selector
 * @param {Object}   options
 *           共通オプション。説明はdatabase-protoを参照
 *           single : 一件削除 {Boolean} サポート
 * @param {Function} callback ({Error} err, {Boolean} success)
 * @return メソッドチェーン
 */
Mongo.prototype.remove =
  function remove (table, selector, options, callback) {
  selector = selector || {};
  options = options || {};
  var op = {w: 1};
  if (options.single) {
    op.single = true;
  }
  try {
    MongoClient.connect(this.connectionString, function(err, db) {
      if (err) {
        if (callback) {
          callback(err, false);
        }
        throw err;
      } else {
        db.collection(table).remove(
          selector || {}
          , op
          , function(err) {
            db.close();
            if (callback) {
              callback(err, true);
            }
          }
        );
      }
    });
  } catch (err) {
    if (callback) {
      callback(err, false);
    }
  }
  return this;
};

/**
 * map-reduceによる集計
 * @method query
 * @param  {String}   table
 * @param  {Function} map
 * @param  {Function} reduce
 * @param  {Object}   options
 * @param  {Function} callback ({Error} err, {Mixed} result)
 * @return メソッドチェーン
 */
Mongo.prototype.mapReduce = function mapReduce (table, map, reduce, options, callback) {
  MongoClient.connect(this.connectionString, function(err, db) {
    if (err) {
      callback(err);
    } else {
      // 要確認
      db.collection(table).mapReduce(
        map
        , reduce
        , {out: { inline: 1 }}
        , callback
      );
    }
  });

  return this;
};

/**
 * (未対応)
 * SQLクエリ発行
 * @method sql
 * @param  {String}   query
 * @param  {Function} callback ({Error} err, {Mixed} result)
 * @return メソッドチェーン
 */
Mongo.prototype.sql = function sql (query, callback) {
  callback(new Error('SQLに対応していません'), null);
  return this;
};

module.exports = exports = Mongo;

// インターフェースチェック
// require('../../is-driver')(new Mongo({}));
