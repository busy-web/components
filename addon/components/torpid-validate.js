/**
 * @module components
 *
 */
import Ember from 'ember';
import TorpidInput from './torpid-input';
import layout from '../templates/components/torpid-validate';

/**
 * `Torpid/Component/TorpidValidate`
 *
 */
export default Ember.Component.extend(
{
	layout: layout,

	classNames: ['torpid-validate'],
	classNameBindings: ['invalid:invalid', 'isValid:valid'],

	type: 'text',
	placeholder: '',
	label: '',
	hint: '',
	error: '',
	value: '',
	invalidError: 'The input is invalid',
	requiredError: 'This is a required field',

	tabindex: 0,
	maxlength: "",

	required: false,

	disabled: false,

	isInvalid: false,
	isValid: false,
	isRequired: false,

	showLabel: true,

	validateExpression: /.*/,

	labelString: function()
	{
		var label = this.get('label');
		if(Ember.isNone(label) || Ember.isEmpty(label))
		{
			label = this.get('placeholder');
		}

		if(this.get('required'))
		{
			label = label + '*';
		}

		return label;
	}.property('placeholder', 'label', 'required'),

	init: function()
	{
		this._super();

		Ember.assert('error is a private variable use invalidError or requiredError for error messages - ' + this.get('error'), Ember.isEmpty(this.get('error')));
	},

	invalid: function()
	{
		var invalid = false;
		if(this.get('isInvalid'))
		{
			invalid = true;
			this.set('error', this.get('invalidError'));
		}
		else if(this.get('isRequired'))
		{
			invalid = true;
			this.set('error', this.get('requiredError'));
		}
		else
		{
			this.set('error', '');
		}

		return invalid;
	}.property('isInvalid', 'isRequired'),

	validate: function(value) //jshint ignore:line
	{
		if(Ember.isEmpty(value) && this.get('required'))
		{
			this.set('isRequired', true);
		}
		else
		{
			this.set('isRequired', false);
		}

		var exp = this.get('validateExpression');
			exp = typeof exp === 'string' ? new RegExp(exp) : exp;

		return exp.test(value);
	},

	checkIfValid: function(value)
	{
		var valid = this.validate(value);

		this.set('isValid', valid);
		this.set('isInvalid', !valid);
	},

	reset: function()
	{
		this.set('isValid', false);
		this.set('isInvalid', false);
		this.set('isRequired', false);
	},

	actions: {
		hintAction: function()
		{
			this.sendAction('onClick');
		}

	},

	torpidInput: TorpidInput.extend(
	{
		placeholderBinding: 'parentView.placeholder',
		typeBinding: 'parentView.type',
		valueBinding: 'parentView.value',
		tabindexBinding: 'parentView.tabindex',

		init: function()
		{
			this._super();

			if(!Ember.isEmpty(this.get('parentView.maxlength')))
			{
				this.set('maxlength', this.get('parentView.maxlength'));
			}
		},

		focusOut: function()
		{
			this.get('parentView').checkIfValid(this.get('value'));

			this.get('parentView').sendAction('onBlur', this.get('value'));
		},

		click: function()
		{
			return false;
		},

		keyUp: function(evt)
		{
			if(evt.which === 13)
			{
				this.get('parentView').sendAction('onSubmit', this.get('value'));
			}

			return true;
		},
	})
});
