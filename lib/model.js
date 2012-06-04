var LOG = require('./log');
var util = require('util');
var columns = require('./columns');
var Model = exports = module.exports = function Model() { };



Model.debug = process.env.NODE_ENV === 'development';



/// inerits from Model to prototype chain
/// and binds Model's static methods
Model.inherits = function(child, parent) {
  util.inherits(child, parent || Model);
  child.create = Model.create;
  child.findBy = Model.findBy;
  child.save = Model.save;
  child.init = Model.init;
  child.getColumn = Model.getColumn;
  child.get = Model.get;
};



var implicit_converter = {
  serializeValue: function(val) { return val; },
  deserializeValue: function(val) { return val; }
}



var initColumn = function(column) {
  // this means Model descendant constructor


  if(column.autoIncrement && this.primaryKey.indexOf(column.name) >= 0)
    this.autoIncrement = column.name;


  if(typeof column.defaultValue === 'undefined')
    column.defaultValue = null;


  // find converter
  var type;
  // if converter is explicitly defined, do nothing
  if(typeof column.converter !== 'object') {
    if(typeof column.converter === 'string') {
      // column.converter is named
      type = column.converter;
    } else {
      // column.converter is undefined
      type = column.type;
      if(typeof type === 'function')
        type = type.name; // Number, Boolean, Date, ... constructor
      else if(type === JSON)
        type = 'json';

      type = type.toLowerCase();
    }

    if(typeof columns[type] !== 'undefined') {
      if(typeof columns[type] === 'function') {
        // converter is class
        column.converter = new (columns[type])(column);
      } else if (typeof columns[type] === 'function') { 
        // converter is instance itself
        column.converter = columns[type];
      } else {
        throw Error("Unresolvable converter in model for table "+this.table+" for column "+column.name);
      }
    } else {
      LOG.WARN('Using implicit converter for column '+column.name+' in '+this.table);
      column.converter = implicit_converter;
    }

  }

};



// this is class level initialization
Model.init = function() {
  // this means Model descendant constructor
  var i,l = this.columns.length;
  var column;
  for(column_name in this.columns) {
    column = this.columns[column_name];
    column.name = column_name;
    initColumn.call(this, column);
  }
};



// set values by NAMES from VALUES to entity
Model.prototype.setValues = function(names, values) {
  if(typeof names === 'string')
    names = names.split(/[\s,;]+/); // split string by whitespaces, colons and semicolons

  if(!Array.isArray(names))
    throw new Error('setValues(names, values) accept only string or array as first argument');

  var i,l = names.length;

  if(Array.isArray(values)) {
    // called as setValues(['name1', 'name2'], ['val1',2]);

    if(names.length !== values.length)
      throw new Error('setValues(names, values) accept only string or array as first argument');

    for(i=0; i<l; i++)
      this.setValue(names[i], values[i]);

  } else if(typeof values === 'object') {
    // called as setValues(['name1', 'name2'], ['val1',2])
    for(i=0; i<l; i++)
      this.setValue(names[i], values[names[i]]);

  } else {
    throw new Error('setValues(names, values) accept only array or object as second argument');
  }
};



Model.getColumn = function(column_name) {
  // this means Model descendant constructor
  // converter should be always defined, if not, correct your code not patch this
  return this.columns[column_name];
}



Model.prototype.getValue = function(column_name, version) {
  var column = this.constructor.getColumn(column_name);

  if(typeof version === 'undefined')
    version = 'current';
  
  if(typeof this[version] !== 'undefined' && typeof this[version][column_name] !== 'undefined')
    return this[version][column_name];

  return this[version][column_name] = column.converter.deserializeValue(this.original[column_name]);
};



Model.prototype.setValue = function(column, value, version) {
  if(typeof version === 'undefined')
    version = 'current';

  if(version === 'current' && 
      typeof(this.current[column]) === 'undefined' && 
      this.original[column] === value)
  {
    return value;
  }
  return this[version][column] = value;
};



var initProperties = function(instance, columns) {
  var name;
  if(Array.isArray(columns)) {
    var i,l=columns.length;
    for(i=0; i<l; i++) {
      name = columns[i];
      instance.__defineGetter__(name, instance.getValue.bind(instance, name));
      instance.__defineSetter__(name, instance.setValue.bind(instance, name));
    }
  } else if(typeof columns === 'object') {
    for(name in columns) {
      instance.__defineGetter__(name, instance.getValue.bind(instance, name));
      instance.__defineSetter__(name, instance.setValue.bind(instance, name));
    }
  }
}



/**
 * Create a new entity for INSERT
 */
Model.create = function(/* curent_values */) {
  // this means Model descendant constructor
  var entity = new this();
  entity.original = {};
  entity.current = {};
  initProperties(entity, this.columns);
  return entity;
};



/**
 * force load original values and set column getters/setters
 */
Model.prototype.load = function(row, columns) {
  if(typeof columns === 'undefined')
    columns = Object.keys(row);
  // this means instance
  // LOG.DEBUG(this.constructor, row, columns);
  this.original = row;
  this.current = {};
  initProperties(this, columns /*this.constructor.columns*/);
};



var mergeObject = function(target, source) {
  for(var name in source)
    target[name] = source[name];
  return target;
};



var queryResultToEntities = function(cb, err, rows, cols) {
  // this means Model descendant (constructor)
  if(err)
    cb(err);
  else {
    var entities = [], i, l=rows.length, entity;
    for(i=0;i<l;i++) {
      var ctor = this;
      entity = new this();
      entity.load(rows[i], cols);
      entities.push(entity);
    }
    cb(null, entities);
  }
};



Model.findBy = function(columns, values, cb) {
  // this means Model descendant (constructor)
  var table = this.table;
  var sql = [];
  sql.push('SELECT * FROM `', table, '` ');
  if(typeof columns === 'function') {
    // select all, columns is callback
    (this.database || Model.database).query(sql.join(''), queryResultToEntities.bind(this, columns));
  } else {
    if(!Array.isArray(columns) && (typeof columns !== 'undefined')) {
      sql.push('WHERE `', columns, '`=?');
      (this.database || Model.database).query(sql.join(''), [values], queryResultToEntities.bind(this, cb));
    } else {
      if(!Array.isArray(values))
        values = [values];
      var operator = 'WHERE ';
      columns.forEach(function(col) {
        sql.push(operator,'`', col, '`=?');
        operator = 'AND ';
      });
      (this.database || Model.database).query(sql.join(''), values, queryResultToEntities.bind(this, cb));
    }
  }
};



/// Get one entity by primary key value(s)
Model.get = function(values, cb) {
  // this means Model descendant (constructor)
  this.findBy(this.primaryKey, values, function(err, results){
    if(err)
      return cb(err);
    if(results.length > 1) {
      return cb(new Error('Multiple entries'), results);
    } else if(results.length < 1) {
      return cb(new Error('Entry not found'), results);
    } else {
      return cb(null, results[0]);
    }
  });
};



Model.insert = function(entity, cb) {
  // this means Model descendant (constructor)
  var sql = [];
  var sqlvals = [];
  var values = [];
  var column;
  var columns = Object.keys(entity.current);
  var converter;

  for(i=0,l=columns.length;i<l;i++) {
    column = columns[i];
    sql.push('`'+column+'`');
    sqlvals.push('?');
    converter = this.getColumn(column).converter;
    values.push(converter.serializeValue(entity.current[column]));
  }
  entity._saving = true;
  
  var tmp_orig = entity.original;
  var tmp_current = entity.current;
  var tmp_cols = Object.keys(entity.current);
  (this.database || Model.database).query('INSERT INTO `' + entity.constructor.table + '` (' +
    sql.join(', ') + ') VALUES (' + sqlvals.join(',') + ')', values,
    function(err, dbResult) {
      entity._saving = false;
      if(err) {
        if(Model.debug)
          console.error('myorm: Query not succeeded: insert ',err,entity);

        entity.original = tmp_orig;

        var modified_cols = Object.keys(entity.current);
        if(modified_cols.length === 0) {
          entity.current = tmp_current;
          if(cb) cb(err, entity);
        } else {
          var new_current = entity.current;
          var new_cols = Object.keys(new_current);
          entity.current = tmp_current;
          var i,l=new_cols.length;
          var col;
          for (var i = 0; i < l; i++) {
            entity.current[col=new_cols[i]] = new_current[col];
          };
          if(cb) cb(err, entity);
        }
      } else {

        if(entity.constructor.autoIncrement && dbResult.insertId) {
          entity.original[entity.constructor.autoIncrement] = dbResult.insertId
        }

        if(cb) cb(null, entity);
      }
    }
  );
  entity.original = entity.current;
  entity.current = {};
  return true;
};



Model.save = function(entity, cb) {
  // this means Model descendant (constructor)

  if(Object.keys(entity.original).length === 0)
    return Model.insert.call(this, entity, cb);

  // db UPDATE
  var columns = Object.keys(entity.current);

  if(columns.length === 0) {
    cb(null, entity)
    return true;
  }

  var value, converter;

  var sql = [];
  var values = [];
  var i,l=columns.length, column;
  for(i=0;i<l;i++) {
    column = columns[i];
    converter = this.getColumn(column).converter;
    value = converter.serializeValue(entity.current[column]);
    if(value === entity.original[column]) {
      delete entity.current[column];
    } else {
      sql.push('`'+column+'`=?');
      values.push(value);
    }
  }

  if(values.length === 0) {
    cb(null, entity)
    return true;
  }

  var sql_where = [];
  var pk = entity.constructor.primaryKey;
  for(i=0, l=pk.length; i < l; i++) {
    column = pk[i];
    sql_where.push('`'+column+'`=?');
    // add to db.query call for escape
    values.push(entity.original[column]);
  }

  var tmp_orig = mergeObject({}, entity.original);
  var tmp_current = mergeObject({}, entity.current);

  entity._saving = true;
  (this.database || Model.database).query(
    'UPDATE `' + entity.constructor.table + '` SET ' + sql.join(', ') + 
    ' WHERE ' + sql_where.join(' AND '),
    values,
    function(err) {
      entity._saving = false;
      if(err) {
        if(Model.debug)
          console.error('myorm: Query not succeeded: save ',err,entity);

        entity.original = tmp_orig;

        var modified_cols = Object.keys(entity.current);
        if(modified_cols.length === 0) {
          entity.current = tmp_current;
          if(cb) cb(err, entity);
        } else {
          var new_current = entity.current;
          entity.current = tmp_current;
          mergeObject(entity.current, new_current);
          if(cb) cb(err, entity);
        }
      } else {
        if(cb) cb(null, entity);
      }
    }
  );
  mergeObject(entity.original, entity.current);
  entity.current = {};
  return true;
};



Model.prototype.save = function(cb) {
  return this.constructor.save(this, cb);
};



//Model.prototype.copy = function() {
//  return this.constructor.create(this);
//}
