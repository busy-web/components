/**
 * @module components
 *
 */
import { assert } from '@ember/debug';
import { isNone, isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/bc-validate';

/**
 * `Component/Validate`
 *
 */
export default Component.extend({
	layout: layout,
	classNames: ['bc-validate', 'bc-validate'],
	classNameBindings: ['invalid:invalid', 'isValid:valid'],

	type: 'text',
	placeholder: '',
	label: '',
	hint: '',
	error: '',
	value: '',
	invalidError: 'The input is invalid',
	requiredError: 'This is a required field',

	autocomplete: null,
	tabindex: 0,
	maxlength: "",

	required: false,
	disabled: false,
	isInvalid: false,
	isValid: false,
	isRequired: false,
	autofocus : false,
	showLabel: true,

	validateExpression: /.*/,

	labelString: computed('placeholder', 'label', 'required', function() {
		let label = this.get('label');
		if (isNone(label) || isEmpty(label)) {
			label = this.get('placeholder');
		}

		if (this.get('required')) {
			label = label + '*';
		}
		return label;
	}),

	init() {
		this._super();
		assert('error is a private variable use invalidError or requiredError for error messages - ' + this.get('error'), isEmpty(this.get('error')));
	},

	invalid: computed('isInvalid', 'isRequired', 'invalidError', 'requiredError', function() {
		let invalid = false;
		if (this.get('isInvalid')) {
			invalid = true;
			this.set('error', this.get('invalidError'));
		} else if (this.get('isRequired')) {
			invalid = true;
			this.set('error', this.get('requiredError'));
		} else {
			this.set('error', '');
		}
		return invalid;
	}),

	validate(value) {
		if (isEmpty(value) && this.get('required')) {
			this.set('isRequired', true);
		} else {
			this.set('isRequired', false);
		}

		let exp = this.get('validateExpression');
		exp = typeof exp === 'string' ? new RegExp(exp) : exp;
		return exp.test(value);
	},

	checkIfValid(value) {
		const valid = this.validate(value);
		this.set('isValid', valid);
		this.set('isInvalid', !valid);
	},

	reset() {
		this.set('isValid', false);
		this.set('isInvalid', false);
		this.set('isRequired', false);
	},

	actions: {
		hintAction() {
			this.sendAction('onClick');
		},

		focusOutAction(value) {
			this.checkIfValid(value);
			this.sendAction('onBlur', value);
		},

		enterAction(value) {
			this.sendAction('onSubmit', value);
		}
	}
});
