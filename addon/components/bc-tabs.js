/**
 * @module components
 *
 */
import { observer } from '@ember/object';
import { dasherize } from '@ember/string';
import $ from 'jquery';
import { next } from '@ember/runloop';
import { isEmpty, isNone } from '@ember/utils';
import { A } from '@ember/array';
import Component from '@ember/component';
import layout from '../templates/components/bc-tabs';

/**
 * `Component/BCTabs`
 *
 * @class BCTabs Component
 *
 * @extends Ember.Component
 */
export default Component.extend({
	layout: layout,

	classNames: ['bc-tabs'],
	classNameBindings: ['active:active'],

	/**
	 * variable to follow which tab is active
	 *
	 * @property active
	 * @type bollean
	 */
	active: false,

	/**
	 * variable for tracking tabNames, is an array
	 *
	 * @property tabNames
	 * @type boolean
	 */
	model: null,
	_tabs: null,
	defaultTab: '',

	init() {
		this._super();
		this.set('_tabs', A());
		window.onhashchange = (() => this.handleHash());
	},

	handleHash() {
		const hash = window.location.hash;
		if (!isEmpty(hash) && hash.match(/^#tab-/)) {
			this.checkHash(hash.replace(/^#tab-/, '').trim());
		} else if (!isEmpty(this.get('defaultTab'))) {
			this.checkHash(this.get('defaultTab'));
		}
	},

	checkHash(hash) {
		if (this.get('model.length') > 0) {
			this.openTab(hash);
		} else {
			next(() => this.checkHash(hash));
		}
	},

	openTab(tabName, isClick) {
		const tabs = this.get('model');
		let didShowTab = false;
		$.each(tabs, (key, value) => {
			if (tabs.hasOwnProperty(key)) {
				if (value.get('active') || value.get('open')) {
					value.set('active', false);
					value.set('open', false);
				}

				if (tabName === dasherize(value.get('tabName').trim())) {
					if (tabName !== this.get('defaultTab')) {
						window.history.replaceState('', document.title, window.location.pathname + '#tab-' + tabName);
					} else if (isClick) {
						window.history.replaceState('', document.title, window.location.pathname);
					}

					if (!value.get('active') || !value.get('open')) {
						value.set('active', true);
						value.set('open', true);
						value.triggerShowTab();
					}
					didShowTab = true;
				}
			}
		});

		if (!didShowTab) {
			this.showDefault();
		}
	},

	addTab(tab) {
		if (this.get('_tabs').indexOf(tab) === -1) {
			this.get('_tabs').pushObject(tab);
		}
	},

	removeTab(tab) {
		this.get('_tabs').removeObject(tab);
	},

	renderTabs() {
		if (!this.get('isDestroyed')) {
			const tabArray = (this.get('_tabs') || []).sortBy('tabIndex');
			tabArray.forEach(item => {
				if (item.get('active') || item.get('open')) {
					item.set('active', false);
					item.set('open', false);
				}
			});

			// set a default tab
			const defaultTab = tabArray.objectAt(0);
			if (!isNone(defaultTab)) {
				this.set('defaultTab', dasherize(defaultTab.get('tabName').trim()));
			}

			this.set('model', tabArray);
			this.handleHash();
		}
	},

	/**
	 * Holds the current timeout for renderTabs
	 *
	 * @property renderTimeout
	 * @type {object}
	 */
	renderTimeout: null,

	/**
	 * Observer for calling render every time a new tab is added to
	 * the _tabs list.
	 *
	 * This is set on a timeout to keep ember from trying to rerender
	 * itself more than once per render try. If the timeout gets called more then
	 * one it will throw awway the other tries and only try once.
	 *
	 * @private
	 * @method shouldRenderTabs
	 * @return {void}
	 */
	shouldRenderTabs: observer('_tabs.[]', function() {
		if (!isNone(this.get('_tabs')) && this.get('_tabs.length') > 0) {
			// remove the current timeout before setting a new timeout
			if (!isNone(this.get('renderTimeout'))) {
				window.clearTimeout(this.get('renderTimeout'));
			}

			// create a timeout to call the renderTabs method
			// if the shouldRenderTabs observer doesnt fire again before
			// it gets the chance
			const timeout = window.setTimeout(() => {
				this.renderTabs();
			}, 10);

			if (!this.get('isDestroyed')) {
				// save the timeout
				this.set('renderTimeout', timeout);
			}
		}
	}),

	showDefault() {
		const tab = this.get('model').objectAt(0);
		tab.set('active', true);
		tab.set('open', true);

		const tabName = dasherize(tab.get('tabName').trim());
		this.set('defaultTab', tabName);

		tab.triggerShowTab();
	},

	actions: {
		changeTab(tab) {
			const tabName = dasherize(tab.get('tabName').trim());
			this.openTab(tabName, true);
		}
	}
});
