/* jshint node: true */
'use strict';

module.exports = {
	name: 'torpid-js',

	included: function(app)
	{
		this._super.included(app);

		this.app.import(app.noeDirectory + '/torpid-js/app/styles/torpid-js.css');
	}
};
