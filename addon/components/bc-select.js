/**
 * @module components
 *
 */
import Ember from 'ember';

/**
 * `Component/Select`
 *
 * @class BcSelect
 *
 * Component select menu for displaying a list of items to a user.
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
	tagName: 'select-menu',

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

	content: null,

	model: null,

	/**
	 * internal use to track the current selected item from the list
	 *
	 * @private
	 * @property selectedItem
	 * @type object
	 */
	selectedItem: Ember.computed('model.@each._selected', 'model.[]', function() {
		var selected = null;
		if (!Ember.isNone(this.get('model'))) {
			selected = this.getSelected();
		}
		return selected;
	}),

	getSelected() {
		var items = this.get('model');
		var selected = null;

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
	defaultLabel: 'Select',

	defaultFirstOption: false,

	menuTitle: Ember.computed('selectedItem', function() {
		var label = this.get('defaultLabel');
		var selectedItem = this.get('selectedItem');

		Ember.assert('"itemLabel" must be set to a property of the model', !Ember.isEmpty(this.get('itemLabel')));

		if (!Ember.isNone(selectedItem)) {
			label = Ember.get(selectedItem, this.get('itemLabel'));
		} else if (this.get('defaultFirstOption')) {
			selectedItem = this.get('model').objectAt(0);
			label = Ember.get(selectedItem, this.get('itemLabel'));
		}
		return label;
	}),

	checkPosition(elem) {
		var isBottom = false;
		if (elem === undefined || elem.get(0).tagName === 'HTML') {
			return isBottom;
		}

		var overflow = window.getComputedStyle(elem.get(0))['overflow-y'];
		var hasOverflow = (overflow === 'auto' || overflow === 'scroll');

		if (hasOverflow) {
			var menuHeightTop = (elem.height() - (elem.height() - this.$().position().top)) - (elem.position().top + 20);
			var menuHeightBot = (elem.height() - this.$().position().top);
			var maxHeight = parseInt(window.getComputedStyle(this.$('.select-container').get(0))['max-height'], 10);

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
		var view = this;
		// trigger other select-menu's to close
		Ember.$('body').trigger('click.bc-select');
		this.set('isOpen', true);

		if (this.checkPosition(this.$())) {
			this.set('isTop', true);
		} else {
			this.set('isTop', false);
		}

		// add event listener to close the menu
		Ember.$('body').bind('click.bc-select', function(e) {
			if (view.get('_state') !== 'destroying') {
				var el = Ember.$(e.target);
				if (view.$().attr('id') !== el.attr('id')) {
					view.closeMenuAction();
				}
			} else {
				Ember.$('body').unbind('click.bc-select');
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
		var items = this.get('model');
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

	toggleMenu() {
		if (!this.get('isOpen')) {
			this.openMenuAction();
		} else {
			this.closeMenuAction();
		}
	},

	/**
	 * click event handler
	 *
	 * @private
	 * @method click
	 * @returns {void}
	 */
	click() {
		this.toggleMenu();
	},

	actions: {
		openMenu() {
			this.toggleMenu();
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
