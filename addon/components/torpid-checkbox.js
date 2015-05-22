import Ember from 'ember';
import layout from '../templates/components/torpid-checkbox';

export default Ember.Component.extend({
  layout: layout,

  classNames: ['torpid-checkbox'],

  tagName: null,

  type: 'checkbox',

  value: false,

  title: null,

  name: null,

  disabled: false,

  checked: function()
  {
    return this.get('value');
  }.property('value'),

  _updateElementValue: function()
  {
    this.set('value', !this.get('value'));
  },

  change: function()
  {
    this._updateElementValue();
    this.sendAction('action', this.get('value'));
  },

});
