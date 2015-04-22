/* jshint node: true */
'use strict';

//var path = require('path');
//var mergeTrees = require('broccoli-merge-trees');
//var pickFiles = require('broccoli-static-compiler');

module.exports = {
	name: 'ember-cli-torpid-js',

//	treeForVendor: function(tree)
//	{
//		var thisPath = this.project.root;
//
//		console.log('\nbuild dir', thisPath, '\n');
//
//		var thisTree = pickFiles(this.treeGenerator(thisPath), {
//			srcDir: '/addon/**/*',
//			destDir: 'torpid-js'
//		});
//
//		console.log('tree', thisTree, '\n');
//		var merge = mergeTrees([tree, thisTree]);
//
//		console.log('merge', merge, '\n');
//		return merge;
//	},
//
//	included: function(app)
//	{
//		this._super.included(app);
//
//		app.import('vendor/torpid-js/torpid-js.js');
//		//app.import(app.bowerDirectory + '/torpid-js/torpid-js.css');
//	}
};
