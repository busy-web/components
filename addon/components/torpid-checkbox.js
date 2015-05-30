/**
 * @module components
 *
 */
import Ember from 'ember';
import layout from '../templates/components/torpid-checkbox';

/**
 * `Component/TorpidCheckbox`
 *
 */
export default Ember.Component.extend(
{
	layout: layout,

	classNames: ['torpid-checkbox'],
	classNameBindings: ['value:checked'],

	title: null,
	value: null,

	group: null,
	name: null,
	disabled: false,

	inputId: function()
	{
		return this.get('group') + '-' + this.get('name') + '-checkbox';
	}.property('group', 'name'),

	init: function()
	{
		this._super();

		if(Ember.isNone(this.get('name')))
		{
			this.set('name', this.random());
		}

		if(Ember.isNone(this.get('group')))
		{
			this.set('group', this.random());
		}
	},

	random: function()
	{
		return Math.floor(((Math.random() * 1000000000) + 100000));
	},

	checkBoxInput: Ember.TextField.extend(
	{
		classNameBindings: ['checked:checked'],
		attributeBindings: ['checked:checked', 'group', 'disabled'],

		type: 'checkbox',

		group: null,
		name: null,
		groupBinding: 'parentView.group',
		nameBinding: 'parentView.name',

		disabled: false,
		disabledBinding: 'parentView.disabled',

		valueBinding: 'parentView.value',

		checked: function()
		{
			return this.get('value');
		}.property('value'),

		change: function()
		{
			var value = !this.get('value');

			this.set('value', value);
			this.get('parentView').sendAction('action', value);

			return false;
		},
	}),

	click: function(e)
	{
		e.stopPropagation();

		return false;
	}
});
