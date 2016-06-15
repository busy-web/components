/* jshint node: true */
'use strict';

module.exports = {
	name: 'busy-components',

	included: function(app /*, parentAddon*/)
	{
		return this._super.included(app);
	}
};
