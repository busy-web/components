/**
 * @module Components
 *
 */
import Ember from 'ember';

/**
 * `BC/Component/Input`
 *
 * @class Input
 * @namespace BC.Components.Input
 * @extends Ember.TextField
 */
export default Ember.TextField.extend({

	classNames: ['bc-input'],
	attributeBindings: ['autofocus'],

	init() {
		this._super();

		if (!Ember.isEmpty(this.get('parentView.maxlength'))) {
			this.set('maxlength', this.get('parentView.maxlength'));
		}
	},

	focusOut() {
		this.sendAction('onBlur', this.get('value'));
	},

	click() {
		return false;
	},

	keyUp(evt) {
		if (evt.which === 13) {
			this.sendAction('onSubmit', this.get('value'));
		}

		this.sendAction('onKeyUp', evt.which, this.get('value'));
		return true;
	}
});
