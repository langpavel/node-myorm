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
}