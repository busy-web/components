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
	classNameBindings: ['checked:checked'],

	defaultValue: false,
	value: false,

	title: null,
	group: null,
	name: null,
	
	disabled: false,

	selectItem: null,

	inputId: function()
	{
		return this.get('group') + '-' + this.get('name') + '-checkbox';
	}.property('group', 'name'),

	setup: function()
	{
		if(this.get('defaultValue'))
		{
			this.set('value', true);
		}

		if(Ember.isNone(this.get('name')))
		{
			this.set('name', this.random());
		}

		if(Ember.isNone(this.get('group')))
		{
			this.set('group', this.random());
		}
	}.observes('defaultValue', 'name', 'group').on('init'),

	random: function()
	{
		return Math.floor(((Math.random() * 1000000000) + 100000));
	},

	checked: function()
	{
		return this.get('value') ? true : false;
	}.property('value'),

	handleChange: function(value)
	{
		this.set('value', value);
		this.sendAction('action', value, this.get('selectItem'));
	},

	checkBoxInput: Ember.TextField.extend(
	{
		classNameBindings: ['checked'],
		attributeBindings: ['checked', 'group', 'disabled'],

		type: 'checkbox',

		group: null,
		groupBinding: 'parentView.group',
		
		name: null,
		nameBinding: 'parentView.name',

		disabled: false,
		disabledBinding: 'parentView.disabled',

		checked: false,
		checkedBinding: 'parentView.checked',

		_value: false,
		_valueBinding: 'parentView.value',

		click: function()
		{
			this.get('parentView').handleChange(!this.get('_value'));
		},
	}),

	click: function(e)
	{
		e.stopPropagation();

		return false;
	}
});
