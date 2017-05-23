/**
 * @module Components
 *
 */
import Ember from 'ember';
import layout from '../templates/components/bc-select-menu';
import BindOutsideClick from '../mixins/bind-outside-click';

/**
 * `Component/BcSelectMenu`
 *
 * @class BcSelectMenu
 * @namespace Components
 * @extends Ember.Component
 */
export default Ember.Component.extend(BindOutsideClick, {
  layout,
	classNames: ['bc-select-menu'],
	classNameBindings: ['right', 'isMenuOpen:open'],

	/**
	 * Flag for open and close of the drop down
	 *
	 * @private
	 * @property isMenuOpen
	 * @type {boolean}
	 */
	isMenuOpen: false,

	/**
	 * Sets the class `right` so the dialog is
	 * formatted for the right side of the screen
	 *
	 * @public
	 * @property right
	 * @type {boolean} default: false
	 */
	right: false,

	/**
	 * Forces the drop down to keep the same label
	 * after an option is selected
	 *
	 * @public
	 * @property disableChange
	 * @type {boolean} default: false
	 */
	disableChange: false,

	/**
	 * Forces the drop down to remain open after
	 * an option is selected
	 *
	 * @public
	 * @property keepOpen
	 * @type {boolean} default: false
	 */
	keepOpen: false,

	/**
	 * Default label for an unselected drop down initial state
	 *
	 * If this option is not set then the first item in the options list will
	 * be used.
	 *
	 * @public
	 * @property label
	 * @type {string}
	 * @default null
	 */
	label: null,

	/**
		* action event triggered when a list option is clicked
		*
		* @public
		* @property onSelect
		* @type {event}
		*/
	onSelect: null,

	/**
	 * Array of options after parsed
	 *
	 * @private
	 * @property listItem
	 * @type {object[]}
	 */
	listItem: null,

	/**
	 * The current selected item from the list. This will be null
	 * until an item is first selected.
	 *
	 * @private
	 * @property selected
	 * @type {object}
	 */
	selected: null,

	/**
	 * The text to display in the select menu button
	 *
	 * @private
	 * @property selectedText
	 * @type {string}
	 */
	selectedText: Ember.computed('selected', 'label', 'listItem.[]', function() {
		if (!Ember.isNone(this.get('selected'))) { // look for a selected option first
			return this.get('selected.label');
		} else if (!Ember.isEmpty(this.get('label'))) { // if no selected option then look for a provided label
			return this.get('label');
		} else if (!Ember.isNone(this.get('listItem'))) { // no option or label then set it to the first option label
			return this.get('listItem.firstObject.label');
		} else { // otherwise just return an empty string
			return '';
		}
	}),

	/**
	 * Initializes the listItem array
	 *
	 * @private
	 * @method setup
	 * @returns {void}
	 */
	setup: Ember.on('willRender', function() {
		if (this.$()) {
			// call bindClick on the ClickedOffComponent mixin
			// to bind a click event to close the dialog
			this.bindClick('closeMenu');

			// get options list
			const data = this.$('select.hidden-select').children();

			// create data array for option data
			const dataArray = [];

			// loop through option data
			data.each((idx, option) => {
				option = Ember.$(option);

				// dont add option that are set to hidden
				if (Ember.isNone(option.attr('hidden'))) {
					// create the option object
					const obj = Ember.Object.create({
						label: option.text(),
						value: option.val(),
						selected: option.is(':selected'),
						disabled: option.is(':disabled')
					});
					dataArray.pushObject(obj);
				}
			});
			this.set('listItem', dataArray);
		}
	}),

	/**
	 * Sets the selected option and unsets all other options
	 * in the listItem option array
	 *
	 * @public
	 * @method setSelected
	 * @params option {object} selcted option object
	 * @return {void}
	 */
	setSelected(option) {
		// unselect all listItem options
		this.get('listItem').forEach(item => item.set('selected', false));

		// set selected on the selected option
		option.set('selected', true);

		this.set('selectedText', option.get('label'));
	},

	actions: {
		/**
		 * Toggles the menu open or close
		 *
		 * Action method
		 *
		 * @private
		 * @method toggleMenu
		 * @returns {void}
		 */
		toggleMenu() {
			this.set('isMenuOpen', !this.get('isMenuOpen'));
		},

		/**
		 * Closes the menu
		 *
		 * Action method
		 *
		 * @private
		 * @method closeMenu
		 * @returns {void}
		 */
		closeMenu() {
			this.set('isMenuOpen', false);
		},

		/**
		 * Sends the onSelect event action
		 *
		 * Action Method
		 *
		 * @private
		 * @method selectAction
		 * @params option {object} An option html object
		 * @returns {void}
		 */
		selectAction(option) {
			// do nothing if disabled is set to
			// true for the item selected
			if (!option.get('disabled')) {
				// set selected unless disableChange
				// is set to true
				if (!this.get('disableChange')) {
					this.setSelected(option);
				}

				// close menu unless keep open
				// is set to true
				if (!this.get('keepOpen')) {
					this.send('closeMenu');
				}

				// send the value of the option to the onSelect callback
				this.sendAction('onSelect', option.get('value'));
			}
		}
	}
});
