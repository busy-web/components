/**
 * @module components
 *
 */
import Ember from 'ember';
import layout from '../templates/components/torpid-list-container';

/**
 * `Component/TorpidListContainer`
 *
 * @class TorpidListContainer Component
 *
 * @extends Ember.Component
 */
export default Ember.Component.extend(
{
	layout: layout,

	classNames: ['torpid-list-container'],
	classNameBindings: ['hasHeader:header'],

	hasHeader: false
});
