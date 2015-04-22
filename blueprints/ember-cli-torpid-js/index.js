/* jshint node: true */
'use strict';

module.exports = {
	normalizeEntityName: function() {}, // no-op since we're just adding dependencies

	afterInstall: function() {
		return this.addBowerPackageToProject('ssh://git@dev.busybusy.com:43700/diffusion/WAPTORPIDJS/torpid-js.git'); // is a promise
	}
};
