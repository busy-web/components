
import Ember from 'ember';
import layout from '../templates/components/torpid-title';

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
