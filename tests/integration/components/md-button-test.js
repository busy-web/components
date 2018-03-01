import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('md-button', 'Integration | Component | md button', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{md-button}}`);
  assert.equal(this.$().text().trim(), '');
});
