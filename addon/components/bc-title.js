/**
 * @module components
 *
 */
import Ember from 'ember';
import layout from '../templates/components/bc-title';

/**
 * `Component/BCTitle`
 *
 * @class BCTitle Component
 *
 * @extends Ember.Component
 */
export default Ember.Component.extend({

	layout: layout,

	classNames: ['bc-title'],

	classNameBindings: ['hasTitle'],

	actions: {
		titleClick: function()
		{
			this.sendAction('onTitleClick');
		}
	}
});
