/**
 * @module components
 *
 */
import Component from '@ember/component';
import layout from '../templates/components/bc-radio-button';

/**
 * `Component/RadioButton`
 *
 */
export default Component.extend({
	layout: layout,
	classNames: ['bc-radio-button', 'bc-radio-button'],

	tagName: null,
	type: 'radio',
	value: null,
	label: null,
	name: null,
	disabled: false,
	checked: false,

	change() {
		this.sendAction('onSelect', this.get('value'));
	},

	click(evt) {
		evt.stopPropagation();
		return true;
	}
});
