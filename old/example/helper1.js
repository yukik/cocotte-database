var schema = {
	driver: 'mongodb'
  , store : {
		host: 'localhost'
	  , port: 27017
	  , db  : 'cocotte'
	  , pool: 1
	}
  , blob : 'file'
  , blobStore: {
		path: '/Users/wapwapeos/Documents'
	}
  , readonly: false
  , modifySchema: true
};

/*
 * スキーマチェックヘルパー
 * コンソールに情報を表示します
 */
var helper = require('cocotte-database/helper');

// helper();

// helper.template();

// helper.help();
// helper.help('store');

// console.log(helper.sanitize(schema));

// helper.nameTest('abc');

// helper.test(schema);
helper.test(schema, true);

// helper.list(__dirname);

// helper.driver();

// var mongoH = helper.driver('mongodb');
// mongoH();
// mongoH.template();
// mongoH.help();
// mongoH.help('host');

// console.log('■DBドライバ - mongodb - 無害化');
// console.log(mongoH.sanitize(schema.store));
// console.log();
// console.log();

// mongoH.test(schema.store);
// mongoH.test(schema.store, true);

// helper.blob();

// var fileH = helper.blob('file');
// fileH();
// fileH.template();
// fileH.help();
// fileH.help('path');

// console.log('■BLOB格納方法 - file - 無害化');
// console.log(fileH.sanitize(schema.blobStore));
// console.log();
// console.log();

// fileH.test(schema.blobStore);
// fileH.test(schema.blobStore, true);
