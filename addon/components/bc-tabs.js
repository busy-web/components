/**
 * @module components
 *
 */
import $ from 'jquery';
import { assert } from '@ember/debug';
import { dasherize } from '@ember/string';
import EmberObject, { get, set, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import Component from '@ember/component';
import layout from '../templates/components/bc-tabs';

/**
 * `Component/BCTabs`
 *
 * @class BCTabs Component
 * @extends Ember.Component
 */
export default Component.extend({
	layout: layout,

	classNames: ['bc-tabs'],

	/**
	 * variable for tracking tabNames, is an array
	 *
	 * @property model
	 * @type object[]
	 */
	model: null,

	defaultTab: '',

	firstRender: false,

	children: computed(function() {
		let content = this.$(`.tab-content`);
		if (content.length) {
			return content.children();
		}
		return [];
	}).volatile(),

	init() {
		this._super();
		this.handleHash();

		//window.onhashchange = (() => this.handleHash());
	},

	didRender() {
		this._super();
		if (!get(this, 'firstRender')) {
			set(this, 'firstRender', true);

			let model = this.buildTabData();
			let activeTab;
			if (!isEmpty(get(this, 'defaultTab'))) {
				activeTab = model.findBy('id', get(this, 'defaultTab'));
			} else {
				activeTab = model[0];
				set(this, 'defaultTab', get(activeTab, 'id'));
			}

			this.openTab(activeTab);
		}
	},

	buildTabData() {
		assert('buildTabData must be called after render', this.$().length > 0);

		let model = [];
		this.$(`.tab-content`).children().each((index, el) => {
			let elData = $(el).data();
			let data = EmberObject.create({
				el, id: elData.id,
				active: false,
				tabName: elData.tabName,
				tabIndex: elData.tabIndex,
				isViewable: elData.isViewable,
				showBadge: elData.showBadge,
				badgeContent: elData.badgeContent,
				badgeColor: elData.badgeColor,
				showTab() {
					set(this, 'active', true);
					elData.showTab();
				},
				hideTab() {
					set(this, 'active', false);
					elData.hideTab();
				},
				on: elData.on,
			});

			// register for child events
			data.on('change', () => {
				console.log('child change', get(data, 'id'));
				this.buildTabData();
			});

			model.push(data);
		});

		// sort models by tabIndex
		model = model.sortBy('tabIndex');
		set(this, 'model', model);
		return model;
	},

	handleHash() {
		const hash = window.location.hash;
		if (!isEmpty(hash) && hash.match(/^#tab-/)) {
			set(this, 'defaultTab', dasherize(hash.replace(/^#tab-/, '').trim()));
		}
	},

	openTab(tab) {
		if (this.$().length > 0) {
			// hide all other tabs
			get(this, 'model').forEach(item => item.hideTab());

			// show the new tab
			tab.showTab();

			// set the history hash
			if (get(tab, 'id') !== get(this, 'defaultTab')) {
				window.history.replaceState('', document.title, `${window.location.pathname}#tab-${get(tab, 'id')}`);
			}
		}
	},

	actions: {
		changeTab(tab) {
			this.openTab(tab);
		}
	}
});
