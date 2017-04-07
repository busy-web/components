/**
 * @module component
 *
 */
import Ember from 'ember';
import layout from '../templates/components/bc-list';

/**
 * `BC/List`
 *
 * @class
 * Renders a list view of model objects
 *
 * bc-list has two event callbacks `onClick` and `onSelect`.
 * The onSelect method must be used with `selector=true` refer to example two
 *
 * @example
 * // example 1
 * {{#bc-list content=controller.content as |item|}}
 *	<!-- image container - left most container for images -->
 *	<div class="bc-list-thumbnail"><img src={{item.imageName}} /></div>
 *
 *	<!-- info container - left aligned container -->
 *	<div class="bc-list-info><h1>{{item.fullName}}</h1></div>
 *
 *	<!-- image container - right aligned container -->
 *	<div class="bc-list-status></div>
 * {{/bc-list}}
 *
 * //example 2
 * {{#bc-list selector=true edit=controller.edit onSelect="mySelectMethod" content=controller.content as |item|}}
 *	<div class="bc-list-thumbnail"><img src={{item.imageName}} /></div>
 *	<div class="bc-list-info><h1>{{item.fullName}}</h1></div>
 * {{/bc-list}}
 *
 * @extends Ember.Component
 */
export default Ember.Component.extend(
{
	layout: layout,
	classNames: ['bc-list'],

	/**
	 * Bool for setting the type of list
	 * true if the list is selectable
	 *
	 * @public
	 * @property selector
	 * @type boolean
	 */
	selector: false,

	/**
	 *
	 * @public
	 * @property hasImage
	 * @type boolean
	 */
	hasImage: false,

	/**
	 * Bool for toggling select mode
	 * set to true to show the select boxes
	 *
	 * @public
	 * @property edit
	 * @type boolean
	 */
	edit: false,

	large: false,
	hasHeader: true,
	minimal: false,
	isSelectAll: false,

	/**
	 * The model array to render in the list
	 *
	 * @public
	 * @property model
	 * @type array
	 */
	model: null,

	clickable: Ember.computed('onClick', function()
	{
		return !Ember.isNone(this.get('onClick')) && !Ember.isEmpty(this.get('onClick')) ? true : false;
	}),

	isLoading: Ember.computed('model', 'model.isLoaded', 'model.[]', 'model.length', function() {
		if (!Ember.isNone(this.get('model'))) {
			if (this.get('model.isLoaded') === true) {
				return false;
			} else if(Ember.isNone(this.get('model.isLoaded'))) {
				return false;
			}
		}
		return true;
	}),

	modelChange: Ember.observer('model.@each.id', function()
	{
		this.set('selectedRows', []);
		this.set('isSelectAll', false);
	}),

	hasModel: Ember.computed('model', function()
	{
		if (this.get('model.length') > 0)
		{
			return true;
		}
	}),

	hasLoadedDOM: Ember.on('didRender', function()
	{
		this.renderTemplates();
	}),

	renderTemplates: function()
	{
		const list = this.$();
		if(list && list.find)
		{
			const row = list.find('section').children('.content-row').first();
			if(row.length > 0)
			{
				const cols = row.children();
				const header = this.$('.bc-list-header.auto-list');

				header.html('');
				header.append('<span class="header-extra"></span>');

				Ember.$.each(cols, (key, item) => {
					let el = Ember.$(item);
					if(!el.hasClass('list-extra'))
					{
						let span = '<span';
						if(el.attr('class') !== undefined)
						{
							span += ' class="' + el.attr('class') + '"';
						}

						span += '>';

						if(el.attr('title') !== undefined)
						{
							span += el.attr('title');
						}

						span += '</span>';

						header.append(span);
					}
				});
			}
		}
	},

	/**
	 * Storage array for all selected rows that get passed to onSelect event callback
	 *
	 * @private
	 * @property selectedRows
	 * @type array
	 */
	selectedRows: null,

	actions: {

		/**
		 * Row clicked action handler
		 *
		 * @private
		 * @method rowClick
		 * @param {Object} model The clicked rows model
		 * @returns {void}
		 */
		rowClick: function(model)
		{
			this.sendAction('onClick', model);
		},

		itemSelected: function(isChecked, row)
		{
			if(Ember.isNone(this.get('selectedRows')))
			{
				this.set('selectedRows', []);
			}

			if(isChecked)
			{
				this.get('selectedRows').pushObject(row);
			}
			else
			{
				this.get('selectedRows').removeObject(row);
			}

			if(this.get('selectedRows.length') === this.get('model.length'))
			{
				this.set('isSelectAll', true);
			}
			else if(this.get('selectedRows.length') === 0)
			{
				this.set('isSelectAll', false);
			}

			this.sendAction('onSelect', isChecked, row);
		},

		selectAll: function(isChecked)
		{
			var model = this.get('model');
			var selectedRows = [];

			if(isChecked)
			{
				this.set('isSelectAll', true);
			}
			else
			{
				this.set('isSelectAll', false);
			}

			model.forEach(function(row)
			{
				if(isChecked)
				{
					row.set('isSelected', true);
				}
				else
				{
					row.set('isSelected', false);
				}

				if(row.get('isSelected'))
				{
					selectedRows.pushObject(row);
				}
				else
				{
					selectedRows.removeObject(row);
				}
			});

			this.set('selectedRows', selectedRows);

			this.sendAction('selectAll', isChecked, selectedRows.copy());
		}
	}
});
