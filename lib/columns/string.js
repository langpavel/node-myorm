var LOG = require('../log');
var Column = require('./column');



function StringColumn(column_definition) {
  this.init(column_definition);
};
Column.inherits(StringColumn);
exports = module.exports = StringColumn;



StringColumn.prototype.init = function(column_definition) {
  if(typeof column_definition === 'undefined')
    column_definition = {};

  // this is same as parent::init(column_definition)
  this.constructor.super_.prototype.init.call(this, column_definition);

  if(this.defaultValue !== null && typeof this.defaultValue !== 'string')
    throw new Error('StringColumn accepts only string or null as valid default value');

  this.length = column_definition.length || null;
}



StringColumn.prototype.normalizeValue = function(val) {
  var result = Column.normalizeValue.call(this, val);
  if(result !== null && typeof result !== 'string')
    result = result.toString();

  if(this.length && val.length > this.length) {
    LOG.WARN('Trimming string value', val);
    result = val.substring(0,this.length);
  }

  return result;
};



StringColumn.prototype.serializeValue = StringColumn.prototype.normalizeValue;
StringColumn.prototype.deserializeValue = StringColumn.prototype.normalizeValue;
