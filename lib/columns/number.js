var Column = require('./column');



function NumberColumn(column_definition) {
  this.init(column_definition);
};
Column.inherits(NumberColumn);
exports = module.exports = NumberColumn;



NumberColumn.prototype.init = function(column_definition) {
  if(typeof column_definition === 'undefined')
    column_definition = {};

  this.constructor.super_.prototype.init.call(this, column_definition);

  if(this.defaultValue !== null && typeof this.defaultValue !== 'number')
    throw new Error('NumberColumn has only number or null type as allowed default value');
}



NumberColumn.prototype.normalizeValue = function(val) {
  var result = Column.normalizeValue.call(this, val);
  if(result !== null)
    result = parseFloat(val);

  // can parseInt return NaN or Infinity?
  if(isNaN(result) || !isFinite(result)) {
    return this.getDefaultValue();
  }
  return result;
};



NumberColumn.prototype.serializeValue = NumberColumn.prototype.normalizeValue;
NumberColumn.prototype.deserializeValue = NumberColumn.prototype.normalizeValue;
