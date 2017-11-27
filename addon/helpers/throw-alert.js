/**
 * @module Helpers
 *
 */
import { helper } from '@ember/component/helper';
import { get } from '@ember/object';

export function throwAlert(params/*, hash*/) {
	return function(model) {
		let str = '';
		for (let i in params) {
			if (/%/.test(params[i])) {
				let val = get(model, params[i].replace(/%/, ''));
				if (val) {
					str += ' ' + val;
				} else {
					str += ' ' + params[i];
				}
			} else {
				str += ' ' + params[i];
			}
		}
		window.alert(str);
	};
}

export default helper(throwAlert);
