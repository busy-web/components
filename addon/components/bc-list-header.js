/**
 * @module component
 *
 */
 import Ember from 'ember';
 import layout from '../templates/components/bc-list-header';

/**
 * `BC/ListHeader`
 *
 */
export default Ember.Component.extend(
{
	layout: layout,

	tagName: 'header',

	classNames: ['bc-list-header'],
	classNameBindings: ['selector', 'edit', 'hasImage:image'],

	selector: false,
	edit: false,
	hasImage: false,

	actions: {
		addAction: function()
		{
			this.sendAction('onAdd');
		}
	}
});
