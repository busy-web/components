import Ember from 'ember';
import layout from '../templates/components/text-field';

export default Ember.TextField.extend(
{
	layout: layout,

	attributeBindings: ['checked', 'group', 'disabled'],

	group: null,
	checked: null,
	disabled: null,
	name: null,

	_value: null,

	click: function()
	{
		this.sendAction('onClick', this.get('_value'));
	},
});
