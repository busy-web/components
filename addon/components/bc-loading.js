/**
 * @module components
 *
 */
import Ember from 'ember';
import layout from '../templates/components/bc-loading';

/**
 * `Component/BCLoading`
 *
 */
export default Ember.Component.extend(
{
	layout: layout,
	classNames: ['bc-loading'],

	classNameBindings: ['isLoading:active', 'minimal'],

	isLoading: false,
	minimal: false,

	loadingMessage: '',
});
