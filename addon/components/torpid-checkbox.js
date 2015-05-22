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

  sendChange: function()
  {
    this.set('checked', !this.get('checked'));
  },

  actions: {
    sendChecked: function()
    {
      this.sendChange();
      console.log(this.get('checked'));
      this.sendAction();
    }
  }

});
