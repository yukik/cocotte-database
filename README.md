cocotte-database
============

# はじめに

フレームワーク`cocotte`でデータベース操作を抽象的に行うことを目的としたモジュールです。  
実際のデータベースの操作はAPIに対応するサブモジュールをインストールする必要があります  

# install & setting

## インストール

```
npm install cocotte-database
```

## 設定

```
var Database = require('cocotte-database');
var db = new Database();
```

# API


## クラスメンバ

# schemaPath

定義ファイル保存ディレクトリ  

```
Database.setPath = '/usr/local/databases';
```

# set

データベースを接続を作成し登録します

```
Database.set(name, schema);
```

# get

登録済みデータベースを取得する

```
var db = Database.get(name);
```

## config

設定からデータベースを作成する  

```
var config = {
  driver: 'cocotte-database-mongodb',
  store: {
    host: '127.0.0.1',
    port: 27017,
    db: 'cocotte'
  }
  readonly: false,
  modifySchema: true
};
var db = new Database(config);
```

 + driver。データベースドライバ省略すると`cocotte-database-cocotte`になります  
 + store。ドライバ毎に固有に設定される接続情報です
 + readonly。読取専用かを設定
 + modifySchema。テーブル構成を変更する事ができるかを設定


## インスタンスメソッド

インスタンスメソッドは、呼び出されただけでは処理を実行しません。  
呼び出し時にコールバック関数を一つだけ引数とする関数が返されます。
そのコールバック関数を通じ、結果を取得したり、例外発生を確認する事が出来ます。

例えば、テーブル一覧を取得する為には、次のように記述します

```
db.getTables()(function(err, result) {
  var tables = result;
});
```

ただし、コールバック地獄になりがちのため、nodeのバージョン0.11以上でサポートされたジェネレータと
`co`モジュールを使用することを推奨します。

`co`を使用して同じテーブル一覧を取得するには、次のように記述します。

```
var co = require('co');
co(function*(){
  var tables = yield db.getTables();
})();
```

次からの例はすべて`co`を使用した場合とします。


## テーブル

### テーブル一覧の取得

```
var tables = yield db.getTables();
```

### テーブルの作成

```
var success = yield db.createTable(table, fields);
```

 + table {String}
 + fields {Object}
 + return {Boolean} success

### テーブルの削除

```
var success = yield db.removeTable(table);
```

 + table {String}
 + return {Boolean} success

## フィールド

### フィールド一覧の取得

```
var fields = yield db.getFields(table);
```

 + table {String}
 + return {Object} fields

### フィールドの追加

```
var success = yield db.addField(table, field, schema);
```

 + table {String}
 + field {String}
 + schema {Object}
 + return {Boolean} success

### フィールドの変更

```
var success = yield db.alterField(table, field, schema);
```

 + table {String}
 + field {String}
 + schema {Object}
 + return {Boolean} success

### フィールドの削除

```
var success = yield db.removeField(table, field);
```

 + table {String}
 + field {String}
 + return {Boolean} success

## インデックス

### インデックス一覧の取得

```
var indexes = yield db.getIndexes(table);
```

 + table {String}
 + return {Array} indexes

### インデックスの追加

```
var success = yield db.addIndex(table, index, options);
```

 + table {String}
 + index {String|Array}
 + options {Object}
 + return {Boolean} success

### インデックスの削除

```
var success = yield db.removeIndex(table, index);
```

 + table {String}
 + index {String|Array}
 + return {Boolean} success

## 行

### 複数行の取得

```
var rows = yield db.find(table, selector, fields, options);
```

 + table {String}
 + selector {String|Array}
 + fields {Array}
 + options {Object}
 + return {Array} rows

### 単行の取得

```
var row = yield db.getRow(table, selector, fields, options);
```

 + table {String}
 + selector {String|Array}
 + fields {Array}
 + options {Object}
 + return {Object} row

### 値の取得

```
var value = yield db.getValue(table, selector, field, options);
```

 + table {String}
 + selector {String|Array}
 + fields {Array}
 + options {Object}
 + return {Array} rows

### 新規の行IDの取得

```
var rowId = yield db.createId(table);
```

 + table {String}
 + return {String} rowId

### 行の保存

必ずrowにrowIdが含まれる必要があります  
そのrowIdと同じ行がデータベースに存在しない場合は追加に存在する場合は更新になります

```
var success = yield db.save(table, row);
```

 + table {String}
 + row {Object}
 + return {Boolean} success


### 行の追加

```
var success = yield db.add(table, row);
```

 + table {String}
 + row {Object}
 + return {Boolean} success


### 行の更新

```
var effecRowCount = yield db.update(table, selector, data);
```

 + table {String}
 + selector {String}
 + data {Object}
 + return {Number} effectRowCount

### 行の削除

```
var effecRowCount = yield db.remove(table, selector);
```

 + table {String}
 + selector {String}
 + return {Number} effectRowCount

## メソッドの実行可能を確認

メソッドはドライバの種類や設定によってすべて実行出来ないものがあります。  
実行できないメソッドを呼び出すと例外が発生します。  
そこで、実行可能かとうかを確認する事ができるプロパティを確認する事ができるようになっています。  
例えばテーブルを作成する事ができるかどうかは次のようにします。

```
var enable = db.enableCreateTable;
```

メソッド名に`enable`を追加したプロパティ名は実行可能かどうかをしめす真偽値を返します。  
追加時にはメソッド名の1文字目は大文字にしてください。
























