/**
 * @module Components
 *
 */
import { dasherize } from '@ember/string';
import { isEmpty } from '@ember/utils';
import { computed, get } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/md-button';

/***/
const kSpecial = ['close', 'view_column'];

/**
 * `Component/MdButton`
 *
 * Create material design buttons
 *
 * @class MdButton
 * @namespace Components
 * @extends Component
 */
export default Component.extend({
	tagName: 'button',
  layout,

	classNames: ['md-button'],
	classNameBindings: ['small', 'right', 'special', 'disabled', 'hover::no-hover'],
	attributeBindings: ['title'],

	/**
	 * adds special css class name to container for icons that
	 * need extra style added to the css.
	 *
	 * @property special
	 * @type {string}
	 */
	special: computed('name', function() {
		if (!isEmpty(get(this, 'name')) && kSpecial.indexOf(get(this, 'name')) !== -1) {
			return dasherize(get(this, 'name'));
		}
		return false;
	}),

	/**
	 * attribute to define the type of icon to be used
	 *
	 * @property name
	 * @type {string}
	 */
	name: '',

	/**
	 * optional title attribute for hover text information
	 *
	 * @property title
	 * @type {string}
	 */
	title: '',

	/**
	 * Adds `small` to the css class names
	 *
	 * @property small
	 * @type {boolean}
	 */
	small: false,

	/**
	 * adds `right` to the css class names
	 *
	 * @property right
	 * @type {boolean}
	 */
	right: false,

	disabled: false,
	hover: true,
	bubbles: true,

	click(evt) {
		if (!get(this, 'disabled')) {
			if (!get(this, 'bubbles')) {
				evt.stopPropagation();
			}

			if (typeof get(this, 'onClick') === 'string') {
				this.sendAction('onClick');
			} else if (typeof get(this, 'onClick') === 'function') {
				get(this, 'onClick')();
			}

			return get(this, 'bubbles');
		}
	}
});
