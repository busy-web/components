import Ember from 'ember';

export default Ember.Component.extend(
{
	classNames: ['torpid-list-container'],

	classNameBindings: ['hasHeader:header'],

	hasHeader: false
});
