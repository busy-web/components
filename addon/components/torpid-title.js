
import Ember from 'ember';

export default Ember.Component.extend({
	
	layout: layout,

	classNames: ['torpid-title'],

	classNameBindings: ['hasTitle'],
	
	actions: {
		titleClick: function()
		{
			this.sendAction('onTitleClick');
		}
	}
});
