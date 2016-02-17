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
	classNameBindings: ['active'],

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
	content: null,
	_tabs: null,

	defaultTab: '',

	init: function()
	{
		this._super();

		this.set('_tabs', Ember.A());
		//this.set('content', Ember.A());

		var _this = this;
		window.onhashchange = function()
		{
			_this.handleHash();
		};

		this.handleHash();
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
		if(this.get('content.length') > 0)
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
		var tabs = this.get('content');
		Ember.$.each(tabs, function(key,value)
		{
			if(tabs.hasOwnProperty(key))
			{
				value.set('active', false);

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

					value.set('active', true);
					value.showTab();
				}
			}
		});
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
			item.set('active', false);
			item.set('open', false);
		});

		var defaultTab = tabArray.objectAt(0);
		this.showDefault(defaultTab);

		this.set('content', tabArray);
	}.observes('_tabs.[]'),

	showDefault: function(tab)
	{
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
