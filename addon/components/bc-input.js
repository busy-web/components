/**
 * @module Components
 *
 */
import Ember from 'ember';

/**
 * `BC/Component/Input`
 *
 * @class Input
 * @namespace BC.Components.Input
 * @extends Ember.Component
 */
export default Ember.Component.extend({

	tagName: 'input',
	classNames: ['bc-input'],

	attributeBindings: ['autofocus', 'value', 'maxlength', 'placeholder', 'type', 'tabindex', 'autocomplete', 'disabled'],

	autofocus: '',
	type: 'text',
	value: '',
	placeholder: '',
	tabindex: '',
	autocomplete: '',
	maxlength: '',
	disabled: false,

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
		const val = this.$().val();

		this.set('value', val);

		console.log('getVal', val);
		return val;
	}
});
