import Ember from 'ember';
import layout from '../templates/components/torpid-radio-button';

export default Ember.Component.extend({
  layout: layout,

  classNames: ['torpid-radio-button'],

  tagName: null,

  type: 'radio',

  value: null,

  label: null,

  name: null,

  disabled: false,

  checked: false,

  change: function()
  {
    this.sendAction('onSelect', this.get('value'));
    console.log(this.get('value'));
  }
});
