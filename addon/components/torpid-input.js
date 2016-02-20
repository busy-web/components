/**
 * @module components
 *
 */
import Ember from 'ember';

/**
 * `Torpid/Component/Input`
 *
 */
export default Ember.TextField.extend(
{
	classNames: ['torpid-input'],

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
		this.sendAction('onBlur', this.get('value'));
	},

	click: function()
	{
		return false;
	},

	keyUp: function(evt)
	{
		if(evt.which === 13)
		{
			this.sendAction('onSubmit', this.get('value'));
		}

		this.sendAction('onKeyUp', evt.which, this.get('value'));
		return true;
	},
});
