/*
 * Note: All datetimes should be in UTC
 * set TZ=/usr/share/zoneinfo/UTC in linux before running node 
 * or better set your system to use UTC in general
 */

var LOG = require('../log');



function DateColumn(column_definition) {
  if(typeof column_definition === 'undefined')
    column_definition = {};
  // add another code to init()
  this.init(column_definition);
}
exports = module.exports = DateColumn;



DateColumn.TRANS_NONE = 0;
DateColumn.TRANS_UNIX = 1;
DateColumn.TRANS_UNIX1000 = 2;



DateColumn.prototype.getDefaultValue = function() {
  if(typeof this.defaultValue === 'function')
    return this.defaultValue();

  return null;
}


function serializeDate(date) {
  if(date === null)
    return null;

  if(date instanceof Date)
    return date;

  if(typeof date === 'string') {
    date = new Date(date);
    if(isNaN(date))
      throw new Error('Invalid Date');
    return date;
  }

  throw new Error('Not Implemented yet');
}


function serializeDateUnix(date) {
  var result = serializeDate(date);
  if(result === null)
    return result;

  return Math.floor(result.getTime()/1000);
}



function serializeDateUnix1000(date) {
  var result = serializeDate(date);
  if(result === null)
    return result;

  return result.getTime();
}



function deserializeDate(date) {
  if(date === null)
    return this.getDefaultValue();

  if(date instanceof Date)
    return date;
}



function deserializeDateUnix(date) {
  if(date === null)
    return null;

  if(typeof date === 'number')
    return new Date(date * 1000);

  throw new Error('Invalid data');
}



function deserializeDateUnix1000(date) {
  if(date === null)
    return null;

  if(typeof date === 'number')
    return new Date(date);

  throw new Error('Invalid data');
}



var transformations = [
  [serializeDate, deserializeDate], // none
  [serializeDateUnix, deserializeDateUnix], // UNIX
  [serializeDateUnix1000, deserializeDateUnix1000]  // UNIX * 1000 (ms resolution, needs Int64)
];



DateColumn.prototype.normalizeValue = function(value) {
  return this.deserializeValue(this.serializeValue(value));
}


DateColumn.prototype.init = function(column_definition) {
  this.defaultValue = column_definition.defaultValue;
  if(typeof this.defaultValue === 'undefined')
    this.defaultValue = null;

  if(typeof this.defaultValue === 'string') {
    switch(this.defaultValue.toLowerCase()) {
      case '':
        this.defaultValue = null;
        break;

      case 'now':
      case 'current_timestamp':
        this.defaultValue = function() { return new Date(); }
        break;

      default:
        throw new Error('Unknown Date default value name: '+this.defaultValue);
    }
  } else if(this.defaultValue !== null && typeof this.defaultValue !== 'function') {
    throw new Error('Invalid Date default value type: '+(typeof this.defaultValue)+': '+this.defaultValue);
  }

  var transformation = column_definition.dateTransformation || 0;
  if(typeof transformation === 'string') {
    switch(transformation.toLowerCase()) {
      // case '': // this is done by OR operator above
      case 'default':
      case 'none':
        transformation = 0;
        break;
      case 'unix':
        transformation = 1;
        break;
      case 'unix1000':
        transformation = 2;
        break;
      default:
        throw new Error('Unknown date transformation: '+transformation.toLowerCase());
    }
  }

  if(typeof transformation !== 'number' || transformation < 0 || transformation > 2)
    throw new Error('Invalid date transformation');

  transformation = transformations[transformation];

  this.serializeValue = transformation[0];
  this.deserializeValue = transformation[1];
};
