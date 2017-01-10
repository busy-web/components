/**
 * @module Helpers
 *
 */
import Ember from 'ember';
import { Assert } from 'busy-utils';

/**
 * `BusyComponent\Helper\GetValue`
 *
 */
export function getValue(params/*, hash*/) {
	var model = params[0];
	var key = params[1];

	Assert.test("You must provide a model of type object for the first param in get-val", !Ember.isNone(model) && typeof model === 'object');
	Assert.test("You must provide a key of type String for the second param in get-val", !Ember.isNone(key) && typeof key === 'string');

	return Ember.get(model, key);
}

export default Ember.Helper.helper(getValue);
