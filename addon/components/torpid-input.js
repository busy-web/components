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

	focusOut: function()
	{
		this.sendAction('onBlur', this.get('value'));
	},

	click: function()
	{
		this.sendAction('onClick', this.get('value'));
		return false;
	},

	keyUp: function(evt)
	{
		if(evt.which === 13)
		{
			this.sendAction('onSubmit', this.get('value'));
		}

		return true;
	},
});
