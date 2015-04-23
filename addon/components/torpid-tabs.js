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
	tabNames: null,

	init: function()
	{
		this._super();

		this.set('tabNames', []);
	},
	
	actions: {
		changeTab: function (tab)
		{
			var tabs = this.get('tabNames');
			Ember.$.each(tabs, function(key,value)
			{
				if(tabs.hasOwnProperty(key))
				{
					value.set('active', false);

					if(tab.get('tabName') === value.get('tabName'))
					{
						value.showTab();
					}
				}
			});
			tab.set('active', true);
		}
	}
});
