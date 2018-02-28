/**
 * @module Mixins
 *
 */
import $ from 'jquery';
import { isEmpty } from '@ember/utils';
import { assert } from '@ember/debug';
import Mixin from '@ember/object/mixin';

/**
 * `Mixin/ClickedOffComponent`
 *
 * this mixin adds a method for binding a click
 * action that will get called when a click is
 * triggered that is not on or in the component
 *
 * @class ClickedOffComponent
 * @namespace Mixins
 * @extends Ember.Mixin
 */
export default Mixin.create({
	/**
	 * binds a click event that will call the provided
	 * action anytime a click occurs not within the component
	 *
	 * NOTE:
	 * The action name provided will get called everytime a click occurs so the
	 * action should only handle on thing like closing a drop down vs toggling a dropdown.
	 * this will prevent accidently opening the dialog when it is closed and a click occurs.
	 *
	 * @public
	 * @method bindClick
	 * @param actionName {string} name of the action to call on the component
	 */
	bindClick(actionName) {
		assert('actionName must be a string', typeof actionName === 'string');

		// save this for later
		const _this = this;

		// get the components elementId
		const elementId = this.get('elementId');

		// make sure an elementId exists on the class
		// using this mixin
		if (!isEmpty(elementId)) {
			// unbind any previous click listeners
			$('body').off(`click.${elementId}`);

			// bind the click listener
			$('body').on(`click.${elementId}`, function(evt) {
				// get the element that was clicked on
				const el = $(evt.target);
				console.log('outside-click', elementId, el.attr('id'), el.parents('#' + elementId).length);

				// if the clicked element id does not match the components id and the clicked
				// elements parents dont have an id that matches then call the action provided
				if (el.attr('id') !== elementId && el.parents(`#${elementId}`).length === 0) {
					// send a call to the actionName
					_this.send(actionName);
					evt.stopPropagation();
					evt.preventDefault();
					return false;
				}
			});
		}
	},

	/**
	 * method to unbind a click event that may have been
	 * setup by this components
	 *
	 * @public
	 * @method unbindClick
	 */
	unbindClick() {
		// get the components elementId
		const elementId = this.get('elementId');

		// make sure an elementId exists on the class
		// using this mixin
		if (!isEmpty(elementId)) {
			// unbind any previous click listeners
			$('body').off(`click.${elementId}`);
		}
	},

	/**
	 * cleanup any click events registerd by this component
	 *
	 * @private
	 * @method destroy
	 */
	willDestroyElement() {
		this._super();

		// unbind clicks
		this.unbindClick();
	}
});

