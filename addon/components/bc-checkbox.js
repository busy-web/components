/**
 * @module components
 *
 */
import { isNone } from '@ember/utils';
import { on } from '@ember/object/evented';
import { computed, observer } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/bc-checkbox';

/**
 * `Component/Checkbox`
 *
 */
export default Component.extend({
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

	inputId: computed('group', 'name', function() {
		return this.get('group') + '-' + this.get('name') + '-checkbox';
	}),

	setup: on('init',  observer('defaultValue', 'name', 'group', function() {
		if (this.get('defaultValue')) {
			this.set('value', true);
		}

		if (isNone(this.get('name'))) {
			this.set('name', this.random());
		}

		if (isNone(this.get('group'))) {
			this.set('group', this.random());
		}
	})),

	random() {
		return Math.floor(((Math.random() * 1000000000) + 100000));
	},

	checked: computed('value', function() {
		return this.get('value') ? true : false;
	}),

	handleChange: function(value) {
		this.set('value', value);
		this.sendAction('action', value, this.get('selectItem'));
	},

	click(e) {
		e.stopPropagation();
		return false;
	},

	actions: {
		inputChanged(value) {
			this.handleChange(value);
		}
	}
});
