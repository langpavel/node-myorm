var Column = require('./column');



function IntegerColumn(column_definition) {
  this.init(column_definition);
};
Column.inherits(IntegerColumn);
exports = module.exports = IntegerColumn;



IntegerColumn.prototype.init = function(column_definition) {
  if(typeof column_definition === 'undefined')
    column_definition = {};

  this.constructor.super_.prototype.init.call(this, column_definition);

  if(this.defaultValue !== null) {
    if(typeof this.defaultValue !== 'number')
      throw new Error('IntegerColumn has only number or null type as allowed default value');

    this.defaultValue = parseInt(this.defaultValue);
  }
}



IntegerColumn.prototype.normalizeValue = function(val) {
  var result = Column.normalizeValue.call(this, val);
  if(result !== null)
    result = parseInt(val);

  // can parseInt return NaN or Infinity?
  if(isNaN(result) || !isFinite(result)) {
    return this.getDefaultValue();
  }
  return result;
};



IntegerColumn.prototype.serializeValue = IntegerColumn.prototype.normalizeValue;
IntegerColumn.prototype.deserializeValue = IntegerColumn.prototype.normalizeValue;
