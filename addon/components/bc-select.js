/**
 * @module Components
 *
 */
import { assert } from '@ember/debug';
import { loc } from '@ember/string';
import { isNone, isEmpty } from '@ember/utils';
import { computed, get, set } from '@ember/object';
import Component from '@ember/component';
import CloseOnEscape from '../mixins/close-on-escape';
import layout from '../templates/components/bc-select';

/**
 * `Component/BCSelect`
 * Component select menu for displaying a list of items to a user.
 *
 * @class BCSelect
 * @namespace Components
 *
 * @property model {array} Array of key-value pair objects
 * @property itemLabel {string} The key of the key-value pair to display in the option list.
 * @property defaultLabel {string} The start label to display in the select menu. `Default: Select`
 * @property defaultFirstOption {boolean} True if the first option in the model array should be displayed. `Default: false`
 * @property menuTitle {string} This should be set if the select menu doesn't change titles when selected. This option overrides defaultLabel and defaultFirstOption.
 * @property onSelect {string} The function name to call when an item is selected. onSelect will pass the selected item to the listener.
 * @property targetObject {object} The View where the onSelect function can be called. `Default: controller`
 */
export default Component.extend(CloseOnEscape, {
	layout,

	classNames: ['bc-select'],
	classNameBindings: ['isOpen:active', 'isTop:top', 'small'],

	__closeActionName: 'closeMenu',

	/**
	 * isOpen tracks the menu open state
	 *
	 * @private
	 * @property isOpen
	 * @type boolean
	 */
	isOpen: false,
	isTop: false,
	small: false,
	openTop: false,
	highlightSlected: true,

	model: null,

	/**
	 * internal use to track the current selected item from the list
	 *
	 * @private
	 * @property selectedItem
	 * @type object
	 */
	selectedItem: computed('model.@each._selected', 'model.[]', function() {
		let selected = null;
		if (!isNone(get(this, 'model'))) {
			selected = this.getSelected();
		}
		return selected;
	}),

	getSelected() {
		const items = get(this, 'model');
		let selected = null;
		if (typeof items === 'object' && typeof items.forEach === 'function') {
			items.forEach(item => {
				if (get(item, '_selected')) {
					selected = item;
				}
			});
		} else {
			Object.keys(items).forEach(key => {
				if (get(items[key], '_selected')) {
					selected = items[key];
				}
			});
		}
		return selected;
	},

	itemLabel: '',
	defaultLabel: loc('Select'),
	defaultFirstOption: false,

	menuTitle: computed('selectedItem', function() {
		let label = get(this, 'defaultLabel');
		let selectedItem = get(this, 'selectedItem');

		assert('"itemLabel" must be set to a property of the model', !isEmpty(get(this, 'itemLabel')));

		if (!isNone(selectedItem)) {
			label = get(selectedItem, get(this, 'itemLabel'));
		} else if (get(this, 'defaultFirstOption')) {
			selectedItem = get(this, 'model').objectAt(0);
			label = get(selectedItem, get(this, 'itemLabel'));
		}
		return label;
	}),

	checkPosition(elem) {
		let isBottom = false;
		if (elem === undefined || elem.get(0).tagName === 'HTML') {
			return isBottom;
		}

		const overflow = window.getComputedStyle(elem.get(0))['overflow-y'];
		const hasOverflow = (overflow === 'auto' || overflow === 'scroll');

		if (hasOverflow || elem.get(0).tagName === 'BODY') {
			let menuHeightTop = elem.height() - (elem.height() - (this.$().offset().top - elem.offset().top)) - 20; // height of the container minus the the bottom space from the top of the button.
			let menuHeightBot = elem.height() - ((this.$().offset().top + this.$().height()) - elem.offset().top) - 20; // height of the container minus the bottom of the select button.
			const maxHeight = parseInt(window.getComputedStyle(this.$('.select-container').get(0))['max-height'], 10);

			if (menuHeightBot < maxHeight) {
				if (menuHeightTop > menuHeightBot) {
					isBottom = true;

					if (menuHeightTop < maxHeight) {
						menuHeightTop = menuHeightTop > 150 ? menuHeightTop : 150;
						this.$('.select-container').css('max-height', menuHeightTop);
					}
				} else {
					menuHeightBot = menuHeightBot > 150 ? menuHeightBot : 150;
					this.$('.select-container').css('max-height', menuHeightBot);
				}
			}
			return isBottom;
		} else {
			return this.checkPosition(elem.parent());
		}
	},

	unselectAll() {
		const items = get(this, 'model');
		if (typeof items === 'object' && typeof items.forEach === 'function') {
			items.forEach(item => {
				set(item, '_selected', false);
			});
		} else {
			Object.keys(items).forEach(key => {
				set(items[key], '_selected', false);
			});
		}
	},

	/**
	 * handles an item click action
	 * and sends the action to any listeners
	 *
	 * @private
	 * @method itemClicked
	 * @param item {object} The list item that was clicked
	 * @returns {void}
	 */
	itemClicked(item) {
		this.unselectAll();

		set(item, '_selected', true);

		//set(this, 'selectedItem', item);
		this.sendAction('onSelect', item);
		this.send('closeMenu');
	},

	onEscape() {
		this.send('closeMenu');
		return false;
	},

	actions: {
		openMenu() {
			if (!get(this, 'isOpen')) {
				this.addEventListener();
				set(this, 'isOpen', true);

				if (get(this, 'openTop')) {
					set(this, 'isTop', true);
				} else {
					if (this.checkPosition(this.$())) {
						set(this, 'isTop', true);
					} else {
						set(this, 'isTop', false);
					}
				}
			} else {
				this.removeEventListener();
				set(this, 'isOpen', false);
			}
		},

		closeMenu() {
			if (!get(this, 'isDestroyed')) {
				this.removeEventListener();
				set(this, 'isOpen', false);
			}
		},

		clickItemAction(item) {
			if (!get(item, '_unselectable')) {
				this.itemClicked(item);
			}
			return false;
		},

		stopPropagation() {
			return false;
		}
	}
});
