/**
 * @module Components
 *
 */
import TextField from '@ember/component/text-field';

/**
 * `BC/Component/Input`
 *
 * @class Input
 * @namespace BC.Components.Input
 * @extends Ember.TextField
 */
export default TextField.extend({

	tagName: 'input',
	classNames: ['bc-input'],

	attributeBindings: ['autofocus', 'maxlength', 'placeholder', 'type', 'tabindex', 'autocomplete', 'disabled', 'min'],

	autofocus: '',
	type: 'text',
	value: '',
	placeholder: '',
	tabindex: '',
	autocomplete: '',
	maxlength: '',
	disabled: false,
	min: '',

	focusOut() {
		this.sendAction('onBlur', this.getVal());
	},

	click() {
		return false;
	},

	keyUp(evt) {
		if (evt.which === 13) {
			this.sendAction('onSubmit', this.getVal());
		}

		this.sendAction('onKeyUp', evt.which, this.getVal());
		return true;
	},

	getVal() {
		return this.get('value');
	}
});
