/**
 * @module components
 *
 */
import Ember from 'ember';
import layout from '../templates/components/bc-checkbox';

/**
 * `Component/Checkbox`
 *
 */
export default Ember.Component.extend(
{
	layout: layout,

	classNames: ['bc-checkbox', 'bc-checkbox'],
	classNameBindings: ['checked:checked'],

	defaultValue: false,
	value: false,

	title: null,
	group: null,
	name: null,
	tabindex: 0,

	disabled: false,

	selectItem: null,

	inputId: Ember.computed('group', 'name', function()
	{
		return this.get('group') + '-' + this.get('name') + '-checkbox';
	}),

	setup: Ember.observer('defaultValue', 'name', 'group', function()
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
	}),

	random: function()
	{
		return Math.floor(((Math.random() * 1000000000) + 100000));
	},

	checked: Ember.computed('value', function()
	{
		return this.get('value') ? true : false;
	}),

	handleChange: function(value)
	{
		this.set('value', value);
		this.sendAction('action', value, this.get('selectItem'));
	},

	click: function(e)
	{
		e.stopPropagation();

		return false;
	},

	actions: {
		inputChanged: function(value)
		{
			this.handleChange(value);
		}
	}
});
