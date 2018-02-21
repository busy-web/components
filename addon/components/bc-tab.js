/**
 * @module Components
 *
 */
import { dasherize } from '@ember/string';
import { set, get, computed, observer } from '@ember/object';
import Evented from '@ember/object/evented';
import Component from '@ember/component';
import layout from '../templates/components/bc-tab';

export default Component.extend(Evented, {
	layout: layout,
	classNames: ['-bc-tab'],
	classNameBindings: ['classId', 'active:active'], // 'open:open'],

	classId: computed('tabName', function() {
		return dasherize(get(this, 'tabName'));
	}),

	active: false,
	//open: false,
	tabName: null,
	tabIndex: 0,

	showBadge: false,
	badgeContent: null,
	badgeColor: null,

	isViewable: true,

	didInsertElement() {
		this._super();

		this.$().data({
			id: get(this, 'classId'),
			active: get(this, 'active'),
			tabName: get(this, 'tabName'),
			tabIndex: get(this, 'tabIndex'),
			isViewable: get(this, 'isViewable'),
			showBadge: get(this, 'showBadge'),
			badgeContent: get(this, 'badgeContent'),
			badgeColor: get(this, 'badgeColor'),
			showTab: ((...args) => this.showTab(...args)),
			hideTab: ((...args) => this.hideTab(...args)),
			on: this.on,
		});
	},

	viewableState: observer('isViewable', function() {
		if (this.$().length && !get(this, 'isDestroyed')) {
			this.$().data('isViewable', get(this, 'isViewable'));
			this.trigger('change');
		}
	}),

	/**
	 * @public
	 * @method showTab
	 */
	showTab() {
		set(this, 'active', true);
	},

	hideTab() {
		set(this, 'active', false);
	}
});
