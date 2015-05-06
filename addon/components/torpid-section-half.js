import Ember from 'ember';
import layout from '../templates/components/torpid-section-half';

export default Ember.Component.extend({
  layout: layout,
	
  classNames: ['torpid-section-half'],
  
  classNameBindings: ['active'],	
});
