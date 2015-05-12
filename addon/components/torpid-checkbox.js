import Ember from 'ember';
import layout from '../templates/components/torpid-checkbox';

export default Ember.Component.extend({
  layout: layout,

  classNames: ['torpid-checkbox'],

  tagName: null,

  type: 'checkbox',

  value: null,

  title: null,

  disabled: false,

  checked: false

});
