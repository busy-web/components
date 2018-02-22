/**
 * @module Components
 *
 */
import { assert } from '@ember/debug';
import { loc } from '@ember/string';
import { isNone, isEmpty } from '@ember/utils';
import { computed, get, set } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/bc-select';
import BindOutsideClick from '../mixins/bind-outside-click';

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
export default Component.extend(BindOutsideClick, {
	layout,

	classNames: ['bc-select'],
	classNameBindings: ['isOpen:active', 'isTop:top', 'small'],

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
		if (!isNone(this.get('model'))) {
			selected = this.getSelected();
		}
		return selected;
	}),

	/**
	 * Initializes the listItem array
	 *
	 * @private
	 * @method setup
	 * @returns {void}
	 */
	didRender() {
		this._super();

		if (this.$()) {
			// call bindClick on the ClickedOffComponent mixin
			// to bind a click event to close the dialog
			this.bindClick('closeMenu');
		}
	},

	getSelected() {
		const items = this.get('model');
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
		let label = this.get('defaultLabel');
		let selectedItem = this.get('selectedItem');

		assert('"itemLabel" must be set to a property of the model', !isEmpty(this.get('itemLabel')));

		if (!isNone(selectedItem)) {
			label = get(selectedItem, this.get('itemLabel'));
		} else if (this.get('defaultFirstOption')) {
			selectedItem = this.get('model').objectAt(0);
			label = get(selectedItem, this.get('itemLabel'));
		}
		return label;
	}),

	/**
	 * click event handler
	 *
	 * @private
	 * @method click
	 * @returns {void}
	 */
	click() {
		this.send('openMenu');
	},

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
		const items = this.get('model');
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

		//this.set('selectedItem', item);
		this.sendAction('onSelect', item);
		this.send('closeMenu');
	},

	actions: {
		openMenu() {
			if (!this.get('isOpen')) {
				this.set('isOpen', true);
				if (this.get('openTop')) {
					this.set('isTop', true);
				} else {
					if (this.checkPosition(this.$())) {
						this.set('isTop', true);
					} else {
						this.set('isTop', false);
					}
				}
			} else {
				this.set('isOpen', false);
			}
		},

		closeMenu() {
			if (!this.get('isDestroyed')) {
				this.set('isOpen', false);
			}
		},

		clickItemAction(item) {
			if (!get(item, '_unselectable')) {
				this.itemClicked(item);
			}
		}
	}
});
