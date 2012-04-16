function BooleanColumn(column_definition) {
  if(typeof column_definition === 'undefined')
    column_definition = {};
  
  if(column_definition.defaultValue === true || 
      column_definition.defaultValue === false ||
      column_definition.defaultValue === null) {
    this.defaultValue = column_definition.defaultValue;
  } else if(typeof column_definition.defaultValue === 'undefined') {
    this.defaultValue = null;
  } else {
    throw new Error('BooleanColumn has only true, false or null as allowed default values');
  }
};
exports = module.exports = BooleanColumn;



var normalize = function(val) {
  if(val === true || val === false)
    return val;

  if(val === null)
      return this.defaultValue;

  switch(typeof val) {
    case 'number':
      return val != 0;
    case 'string':
      val = val.toLowerCase();
      return val === 'yes' || val === '1' || val === '\x01' || val === 'true' || val === 'on';
    case 'undefined':
      return this.defaultValue;
    default:
      throw new Error('Not convertible to bool from '+(typeof val));
  }
}



BooleanColumn.prototype.normalizeValue = normalize;
BooleanColumn.prototype.serializeValue = normalize;
BooleanColumn.prototype.deserializeValue = normalize;
