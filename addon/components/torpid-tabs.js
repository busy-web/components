/**
 * @module components
 *
 */
import Ember from 'ember';
import layout from '../templates/components/torpid-tabs';

/**
 * `Component/TorpidTabs`
 *
 * @class TorpidTabs Component
 *
 * @extends Ember.Component
 */
export default Ember.Component.extend(
{
	layout: layout,

	classNames: ['torpid-tabs'],
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

	init: function()
	{
		this._super();

		this.set('_tabs', Ember.A());

		var _this = this;
		window.onhashchange = function()
		{
			_this.handleHash();
		};
	},

	handleHash: function()
	{
		var hash = window.location.hash;
		if(!Ember.isEmpty(hash) && hash.match(/^#tab-/))
		{
			this.checkHash(hash.replace(/^#tab-/, '').trim());
		}
		else if(!Ember.isEmpty(this.get('defaultTab')))
		{
			this.checkHash(this.get('defaultTab'));
		}
	},

	checkHash: function(hash)
	{
		if(this.get('model.length') > 0)
		{
			this.openTab(hash);
		}
		else
		{
			Ember.run.next(this, function()
			{
				this.checkHash(hash);
			});
		}
	},

	openTab: function(tabName, isClick)
	{
		var _this = this;
		var tabs = this.get('model');
		var didShowTab = false;
		Ember.$.each(tabs, function(key,value)
		{
			if(tabs.hasOwnProperty(key))
			{
				if(value.get('active') || value.get('open'))
				{
					value.set('active', false);
					value.set('open', false);
				}

				if(tabName === value.get('tabName').trim().dasherize())
				{
					if(tabName !== _this.get('defaultTab'))
					{
						window.history.replaceState('', document.title, window.location.pathname + '#tab-' + tabName);
					}
					else if(isClick)
					{
						window.history.replaceState('', document.title, window.location.pathname);
					}

					if(!value.get('active') || !value.get('open'))
					{
						value.set('active', true);
						value.set('open', true);
						value.triggerShowTab();
					}

					didShowTab = true;
				}
			}
		});

		if(!didShowTab)
		{
			this.showDefault();
		}
	},

	addTab: function(tab)
	{
		this.get('_tabs').pushObject(tab);
	},

	renderTabs: function()
	{
		var tabArray = this.get('_tabs').sortBy('tabIndex');
		tabArray.forEach(function(item)
		{
			if(item.get('active') || item.get('open'))
			{
				item.set('active', false);
				item.set('open', false);
			}
		});

		// set a default tab
		var defaultTab = tabArray.objectAt(0);
		if(!Ember.isNone(defaultTab))
		{
			this.set('defaultTab', defaultTab.get('tabName').trim().dasherize());
		}

		this.set('model', tabArray);
		this.handleHash();
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
	shouldRenderTabs: function()
	{
		if(!Ember.isNone(this.get('_tabs')) && this.get('_tabs.length') > 0)
		{
			// remove the current timeout before setting a new timeout
			if(!Ember.isNone(this.get('renderTimeout')))
			{
				window.clearTimeout(this.get('renderTimeout'));
			}

			// create a timeout to call the renderTabs method
			// if the shouldRenderTabs observer doesnt fire again before
			// it gets the chance
			var _this = this;
			var timeout = window.setTimeout(function()
			{
				_this.renderTabs();
			}, 10);

			// save the timeout
			this.set('renderTimeout', timeout);
		}
	}.observes('_tabs.[]'),

	showDefault: function()
	{
		var tab = this.get('model').objectAt(0);
			tab.set('active', true);
			tab.set('open', true);

		var tabName = tab.get('tabName').trim().dasherize();
		this.set('defaultTab', tabName);

		tab.triggerShowTab();
	},

	actions: {
		changeTab: function (tab)
		{
			var tabName = tab.get('tabName').trim().dasherize();
			this.openTab(tabName, true);
		}
	}
});
