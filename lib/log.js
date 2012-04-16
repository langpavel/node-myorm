var util = require('util');
var EventEmitter = require('events').EventEmitter;



function LogManager(){};
util.inherits(LogManager, EventEmitter);



// now export manager
var manager = module.exports = exports = new LogManager();



manager.levels = ['FATAL', 'ERROR', 'WARN', 'NOTICE', 'LOG', 'INFO', 'DEBUG', 'VERBOSE'];


/*
LogManager.prototype.registerConsole = function() {
  this.
}
*/



manager.levels.forEach(function(level){
  LogManager.prototype[level] = manager.emit.bind(manager, 'log', level);
});
