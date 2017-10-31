/**
 * @module Helpers
 *
 */
import { helper } from '@ember/component/helper';
import { get } from '@ember/object';
import { isNone } from '@ember/utils';
import { assert } from '@ember/debug';

/**
 * `BusyComponent\Helper\GetValue`
 *
 */
export function getValue(params/*, hash*/) {
	const model = params[0];
	const key = params[1];

	assert("You must provide a model of type object for the first param in get-val", !isNone(model) && typeof model === 'object');
	assert("You must provide a key of type String for the second param in get-val", !isNone(key) && typeof key === 'string');

	return get(model, key);
}

export default helper(getValue);
