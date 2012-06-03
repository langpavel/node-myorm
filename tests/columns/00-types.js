var columns = require('../../.').columns;



exports['Column types'] = function(test) {
  test.expect(6);
  test.strictEqual(columns['boolean'].name, 'BooleanColumn');
  test.strictEqual(columns['date'].name, 'DateColumn');
  test.strictEqual(columns['json'].name, 'JSONColumn');
  test.strictEqual(columns['number'].name, 'NumberColumn');
  test.strictEqual(columns['integer'].name, 'IntegerColumn');
  test.strictEqual(columns['string'].name, 'StringColumn');
  test.done();
}
