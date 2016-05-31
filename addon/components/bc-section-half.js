import Ember from 'ember';
import layout from '../templates/components/bc-section-half';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'section',

  classNames: ['bc-section-half'],

  classNameBindings: ['active'],
});
