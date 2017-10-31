/**
 * @module Components
 *
 */
import Ember from 'ember';
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
export default Ember.Component.extend({
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
	selectedItem: Ember.computed('model.@each._selected', 'model.[]', function() {
		let selected = null;
		if (!Ember.isNone(this.get('model'))) {
			selected = this.getSelected();
		}
		return selected;
	}),

	getSelected() {
		const items = this.get('model');
		let selected = null;
		if (typeof items === 'object' && typeof items.forEach === 'function') {
			items.forEach(item => {
				if (Ember.get(item, '_selected')) {
					selected = item;
				}
			});
		} else {
			Object.keys(items).forEach(key => {
				if (Ember.get(items[key], '_selected')) {
					selected = items[key];
				}
			});
		}
		return selected;
	},

	itemLabel: '',
	defaultLabel: Ember.String.loc('Select'),
	defaultFirstOption: false,

	menuTitle: Ember.computed('selectedItem', function() {
		let label = this.get('defaultLabel');
		let selectedItem = this.get('selectedItem');

		Ember.assert('"itemLabel" must be set to a property of the model', !Ember.isEmpty(this.get('itemLabel')));

		if (!Ember.isNone(selectedItem)) {
			label = Ember.get(selectedItem, this.get('itemLabel'));
		} else if (this.get('defaultFirstOption')) {
			selectedItem = this.get('model').objectAt(0);
			label = Ember.get(selectedItem, this.get('itemLabel'));
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
		if (!this.get('isOpen')) {
			this.openMenuAction();
		} else {
			this.closeMenuAction();
		}
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

	/**
	 * Opens the list menu and sets up a global click event to
	 * watch for clicks not in the menu to close the menu
	 *
	 * @private
	 * @method openMenuAction
	 * @returns {void}
	 */
	openMenuAction() {
		const $body = Ember.$('body');

		// trigger other select-menu's to close
		$body.trigger('click.bc-select');

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

		// add event listener to close the menu
		$body.bind('click.bc-select', (e) => {
			if (!this.get('isDestroyed')) {
				const $el = Ember.$(e.target);

				if (this.$().attr('id') !== $el.attr('id')) {
					this.closeMenuAction();
				}
			} else {
				$body.unbind('click.bc-select');
			}
		});
	},

	/**
	 * Closes the list menu and destroys the global
	 * click watcher
	 *
	 * @private
	 * @method closeMenuAction
	 * @returns {void}
	 */
	closeMenuAction() {
		this.set('isOpen', false);
		Ember.$('body').unbind('click.bc-select');
	},

	unselectAll() {
		const items = this.get('model');
		if (typeof items === 'object' && typeof items.forEach === 'function') {
			items.forEach(item => {
				Ember.set(item, '_selected', false);
			});
		} else {
			Object.keys(items).forEach(key => {
				Ember.set(items[key], '_selected', false);
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

		Ember.set(item, '_selected', true);

		//this.set('selectedItem', item);
		this.sendAction('onSelect', item);
		this.closeMenuAction();
	},

	actions: {
		openMenu() {
			if (!this.get('isOpen')) {
				this.openMenuAction();
			} else {
				this.closeMenuAction();
			}
		},

		closeMenu() {
			this.closeMenuAction();
		},

		clickItemAction(item) {
			if (!Ember.get(item, '_unselectable')) {
				this.itemClicked(item);
			}
		}
	}
});
