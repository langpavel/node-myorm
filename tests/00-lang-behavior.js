var EventEmitter = require('events').EventEmitter;



exports['is EventEmitter#emit synchronous'] = function(test) {
  test.expect(1);

  var scopeDone = false;
  var e = new EventEmitter();

  e.emit('test', false);

  e.on('test', function(arg) {
    test.ok(scopeDone && arg, 'EventEmitter#emit');
    test.done();
  });

  e.on('error', function() {
    test.done();
  });

  scopeDone = true;

  e.emit('test', true);
};


exports['if Array.isArray working'] = function(test) {
  test.expect(3);

  test.equal(typeof Array.isArray, 'function');
  test.ok(Array.isArray([]));
  test.ok(!Array.isArray({"0": 0, length: 1}));

  test.done();
};
