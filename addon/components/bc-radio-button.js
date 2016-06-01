/**
 * @module components
 *
 */
import Ember from 'ember';
import layout from '../templates/components/bc-radio-button';

/**
 * `Component/RadioButton`
 *
 */
export default Ember.Component.extend(
{
	layout: layout,

	classNames: ['bc-radio-button', 'bc-radio-button'],

	tagName: null,
	type: 'radio',
	value: null,
	label: null,
	name: null,
	disabled: false,
	checked: false,

	change: function()
	{
		this.sendAction('onSelect', this.get('value'));
	},

	click: function(evt)
	{
		evt.stopPropagation();
		return true;
	}
});
