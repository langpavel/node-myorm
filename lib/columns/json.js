function JSONColumn(column_definition) {
  if(typeof column_definition === 'undefined')
    column_definition = {};
  
  this.defaultValue = (typeof column_definition.defaultValue === 'undefined') ?
    null : column_definition.defaultValue;

  if(typeof this.defaultValue === 'object' && this.defaultValue !== null)
    this.defaultValue = JSON.stringify(this.defaultValue);
};
exports = module.exports = JSONColumn;


/*
var prototype_clone = function(what) {
  if(what === null)
    return null;
  
  var clone = function(){};
  clone.prototype = what;
  return new clone();
};
*/


JSONColumn.prototype.normalizeValue = function(value) {
  return value;
}


JSONColumn.prototype.serializeValue = function(val) {
  // this means column instance
  if(val === null || typeof val === 'undefined')
    return JSON.parse(this.defaultValue);

  return JSON.stringify(val);
}



JSONColumn.prototype.deserializeValue = function(val) {
  // this means column instance
  if(val === null || typeof val === 'undefined')
    return JSON.parse(this.defaultValue);

  return JSON.parse(val);
}
