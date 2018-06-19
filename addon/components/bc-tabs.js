/**
 * @module components
 *
 */
import $ from 'jquery';
import { assert } from '@ember/debug';
import { dasherize } from '@ember/string';
import EmberObject, { get, set } from '@ember/object';
import { isNone, isEmpty } from '@ember/utils';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from '../templates/components/bc-tabs';
import parse from '../utils/parse';

/***/
const TAB_CONTENT = '.--bc-tabs-content';

function getQueryParams() {
	// get url search params
	let search = window.location.search.slice(1);

	// parse params to an object
	let params = {};
	if (!isEmpty(search)) {
		params = parse(search);
	}

	// return params
	return params;
}

function getTabFromQueryParams(params=null) {
	// get params if none are passed in
	if (params === null) {
		params = getQueryParams();
	}

	// get tab if the tab is not an emptry string or array and
	// the tab is not null or undefined
	// otherwise return '' (empty string)
	if (!isEmpty(get(params, 'bc_tab'))) {
		return dasherize(get(params, 'bc_tab'));
	}
	return null;
}

/**
 * `Component/BCTabs`
 *
 * @class BCTabs Component
 * @extends Ember.Component
 */
export default Component.extend({
	layout: layout,

	classNames: ['--bc-tabs'],

	router: service(),
	useRouter: true,

	/**
	 * variable for tracking tabNames, is an array
	 *
	 * @property model
	 * @type object[]
	 */
	model: null,

	defaultTab: '',
	currentTab: '',
	hashName: '',

	firstRender: false,

	init() {
		this._super();
		this.handleHash();
	},

	didRender() {
		this._super();

		if (!get(this, 'firstRender')) {
			set(this, 'firstRender', true);

			let model = this.buildTabData();
			if (!isEmpty(model)) {
				if (isEmpty(get(this, 'defaultTab'))) {
					let ftab = model.filterBy('isViewable', true).get('firstObject');
					set(this, 'defaultTab', get(ftab, 'id'));
				}

				let activeTab;
				if (!isEmpty(get(this, 'hashName'))) {
					activeTab = model.findBy('id', get(this, 'hashName'));
				}

				if (isNone(activeTab) && !isEmpty(get(this, 'defaultTab'))) {
					activeTab = model.findBy('id', get(this, 'defaultTab'));
					if (isNone(activeTab)) {
						activeTab = model.filterBy('isViewable', true).get('firstObject');
						set(this, 'defaultTab', get(activeTab, 'id'));
					}
				}

				this.openTab(activeTab);
			}
		}
	},

	buildTabData() {
		assert('buildTabData must be called after render', this.$().length > 0);

		let model = [];
		this.$(TAB_CONTENT).children().each((index, el) => {
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
				this.buildTabData();
			});

			model.push(data);
		});

		if (get(model, 'length') > 0) {
			// sort models by tabIndex
			model = model.sortBy('tabIndex');
		}

		set(this, 'model', model);
		return model;
	},

	handleHash() {
		const hash = window.location.hash;
		if (!isEmpty(hash) && hash.search(/^#tab-/) !== -1) {
			const name = dasherize(hash.replace(/^#tab-/, '').trim());
			set(this, 'hashName', name);
		} else {
			set(this, 'hashName', getTabFromQueryParams());
		}
	},

	openTab(tab) {
		if (this.$().length > 0) {
			// hide all other tabs
			get(this, 'model').forEach(item => item.hideTab());

			// show the new tab
			tab.showTab();
			let tabname = get(tab, 'id');
			const params = getQueryParams();
			const curTab = getTabFromQueryParams(params);

			if (isEmpty(tabname) || tabname === get(this, 'defaultTab')) {
				tabname = null;
			}

			if (curTab !== tabname) {
				set(this, 'hashName', tabname);

				if (get(this, 'useRouter') && !isNone(get(this, 'router'))) {
					set(params, 'bc_tab', tabname);
					get(this, 'router').replaceWith(get(this, 'router.currentRouteName'), { queryParams: params });
				} else {
					if (!isNone(tabname)) {
						window.history.replaceState('', document.title, `${window.location.pathname}#tab-${tabname}`);
					} else {
						window.history.replaceState('', document.title, window.location.pathname);
					}
				}
			}

			set(this, 'currentTab', tab);
		}
	},

	triggerTabChange() {
		this.handleHash();
		let id = get(this, 'hashName') || get(this, 'defaultTab');
		let tab = get(this, 'model').findBy('id', id);
		if (tab && tab.id !== get(this, 'currentTab.id')) {
			this.openTab(tab);
		}
	},

	didInsertElement() {
		this._super(...arguments);

		// setup router didTransition
		const router = get(this, 'router._router');
		if (router && router.on) {
			router.on('didTransition', this, this.triggerTabChange);
		}
	},

	willDestroyElement() {
		this._super(...arguments);

		const router = get(this, 'router._router');
		if (router && router.off) {
			router.off('didTransition', this, this.triggerTabChange);
		}
	},

	actions: {
		changeTab(tab) {
			this.openTab(tab);
		}
	}
});
