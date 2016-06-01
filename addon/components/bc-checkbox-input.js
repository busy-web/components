import Ember from 'ember';
import layout from '../templates/components/bc-checkbox-input';

export default Ember.TextField.extend(
{
	layout: layout,

	classNameBindings: ['checked'],
	attributeBindings: ['checked', 'group', 'disabled'],

	type: 'checkbox',
	group: null,
	name: null,
	disabled: false,
	checked: false,
	_value: false,

	click: function()
	{
		this.sendAction('onChange', !this.get('_value'));
	},
});
