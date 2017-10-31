/**
 * @module components
 *
 */
import Component from '@ember/component';
import layout from '../templates/components/bc-loading';

/**
 * `Component/BCLoading`
 *
 */
export default Component.extend({
	layout: layout,
	classNames: ['bc-loading'],
	classNameBindings: ['isLoading:active', 'minimal', 'fixed', 'inline'],
	isLoading: false,
	minimal: false,
	fixed: true,
	loadingMessage: '',
});
