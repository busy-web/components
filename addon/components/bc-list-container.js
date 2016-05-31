/**
 * @module components
 *
 */
import Ember from 'ember';
import layout from '../templates/components/bc-list-container';

/**
 * `Component/BCListContainer`
 *
 * @class BCListContainer Component
 *
 * @extends Ember.Component
 */
export default Ember.Component.extend(
{
	layout: layout,

	classNames: ['bc-list-container'],
	classNameBindings: ['hasHeader:header'],

	hasHeader: false
});
