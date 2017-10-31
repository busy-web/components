import TextField from '@ember/component/text-field';
import layout from '../templates/components/bc-checkbox-input';

export default TextField.extend({
	layout: layout,

	classNameBindings: ['checked'],
	attributeBindings: ['checked', 'group', 'disabled'],

	type: 'checkbox',
	group: null,
	name: null,
	disabled: false,
	checked: false,
	_value: false,

	click() {
		this.sendAction('onChange', !this.get('_value'));
	},
});
