/**
 * @module Components
 *
 */
import Component from '@ember/component';
import layout from '../templates/components/bc-section-half';

export default Component.extend({
  layout: layout,
  tagName: 'section',
  classNames: ['bc-section-half'],
  classNameBindings: ['active'],
});
