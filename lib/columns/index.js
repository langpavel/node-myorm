var fs = require('fs');
fs.readdirSync(__dirname).forEach(function(filename){
  var name = filename.match(/^([^\.]+)\.js$/i);
  if(name && name[1] !== 'index') {
    exports[name[1]] = require('./'+name[1]);
  }
});
