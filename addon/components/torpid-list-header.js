/**
 * @module component
 *
 */
import Ember from 'ember';
import layout from '../templates/components/torpid-list-header';

/**
 * `Torpid/ListHeader`
 *
 */
export default Ember.Component.extend(
{
	layout: layout,

	tagName: 'header',

	classNames: ['torpid-list-header'],
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
