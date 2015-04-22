/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-torpid-js',

  included: function(app)
  {
	this._super.included(app);

	app.import(app.bowerDirectory + '/torpid-js/torpid-js.min.js');
	app.import(app.bowerDirectory + '/torpid-js/torpid-js.css');
  }
};
