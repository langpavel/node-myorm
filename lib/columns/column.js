var util = require('util');



/**
 * class Column - constructor
 */
function Column(column_definition) {
  this.init(column_definition);
};
exports = module.exports = Column;



/**
 * static helper for inheritance
 */
Column.inherits = function(child, parent) {
  util.inherits(child, parent || Column);
  // set implicit static implementation
  child.normalizeValue = Column.normalizeValue;
}



/**
 * Column#init
 */
Column.prototype.init = function(column_definition) {
  // you should copy this to your init function
  if(typeof column_definition === 'undefined')
    column_definition = {};

  this.nullable = !! column_definition.nullable;
  this.defaultValue = column_definition.defaultValue;
  if(typeof this.defaultValue === 'undefined')
    this.defaultValue = null;
};



Column.prototype.getDefaultValue = function() {
  return this.defaultValue;
}


/**
 * implicit implementation
 */
var normalizeValue = Column.normalizeValue = function(value) {
  if(typeof value === 'undefined' || value === null)
    return this.getDefaultValue();

  return value;
}



/**
 * Column#normalizeValue should return same as deserialize(serialize(value)) do
 */
Column.prototype.normalizeValue = normalizeValue;


Column.prototype.serializeValue = normalizeValue;


Column.prototype.deserializeValue = normalizeValue;
