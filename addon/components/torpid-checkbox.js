import Ember from 'ember';
import layout from '../templates/components/torpid-checkbox';

export default Ember.Component.extend({
  layout: layout,

  classNames: ['torpid-checkbox'],

  tagName: null,

  type: 'checkbox',

  value: null,

  title: null,

  name: null,

  disabled: false,

  checked: false,

  _updateElementValue: function()
  {
    this.set('checked', !this.get('checked'));
  },

  change: function(event)
  {
    this._updateElementValue();
    this.sendAction('action', this.get('value'), this.get('checked'));
    var checked = this.get('checked');
    console.log(checked);
  },

});
