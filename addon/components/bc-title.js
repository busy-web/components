/**
 * @module components
 *
 */
import Component from '@ember/component';
import layout from '../templates/components/bc-title';

/**
 * `Component/BCTitle`
 *
 * @class BCTitle Component
 *
 * @extends Ember.Component
 */
export default Component.extend({
	layout: layout,
	classNames: ['bc-title'],
	classNameBindings: ['hasTitle'],

	actions: {
		titleClick() {
			this.sendAction('onTitleClick');
		}
	}
});
