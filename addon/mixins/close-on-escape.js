/**
 * @module Mixins
 *
 */
//import $ from 'jquery';
import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
	escape: service('escape-handler'),

	bindEscape() {
		this.get('escape').addListener(this, this.get('elementId'));
	},

	unbindEscape() {
		this.get('escape').removeListener(this.get('elementId'));
	},

	onEscape() { },

	willDestroyElement() {
		this._super();
		this.unbindEscape();
	}
});
