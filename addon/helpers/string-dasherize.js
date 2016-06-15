import Ember from 'ember';

export function stringDasherize(params/*, hash*/)
{
	Ember.assert('You must pass a string to string-dasherize helper', typeof params[0] === 'string');

	return (params[0]).dasherize();
}

export default Ember.Helper.helper(stringDasherize);
