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

  actions: {
    sendChecked: function()
    {
      console.log(this.get('checked'));
      this.sendAction();
    }.observes('checked')
  }

});
