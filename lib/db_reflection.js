var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var log = function() {};
var out = console.log.bind(console);


var DbReflection = exports = module.exports = function DbReflection (){};
util.inherits(DbReflection, EventEmitter);


DbReflection.prototype.loadTables = function() {
  var self = this;
  this.constructor.database.query('SHOW TABLES', function(err, rows, cols) {
    if(err) {
      self.emit('error', err);
      return;
    }


    var colname = Object.keys(cols)[0];
    self.tables = rows.map(function(row) { return row[colname]; });
    process.nextTick(self.emit.bind(self,'tables', self.tables, self));
  });
};



DbReflection.prototype.loadTable = function(table) {
  var self = this;

  
  this.constructor.database.query('SELECT '+
        'a.COLUMN_NAME as name,'+
        'a.DATA_TYPE as type, '+
        'a.COLUMN_TYPE as sql_type, '+
        'a.CHARACTER_MAXIMUM_LENGTH as length, '+
        'a.IS_NULLABLE as isnull, '+
        'a.COLUMN_KEY as have_key, '+
        'a.COLUMN_COMMENT as comment, ' +
        'a.COLUMN_DEFAULT as default_value, ' +
        'a.EXTRA as extra '+
      'FROM information_schema.columns as a ' +
      'where a.table_name = ? AND  a.table_schema = ? ' +
      'order by a.ORDINAL_POSITION', [table,this.constructor.database.database], 
    function(err, rows, cols) {
      if(err) {
        self.emit('error', err);
        return;
      }

      var result = { 
        name: table, 
        primaryKey: []
      };

      result.columns = rows.map(function(column){
        if(column.have_key === 'PRI')
          result.primaryKey.push(column.name);
        column.isnull = column.isnull.toUpperCase() === 'YES';
        return column;
      });

      self.emit('table', result, self);
    }
  );
};



DbReflection.reflectAll = function(connection) {
  DbReflection.database = connection;

  var reflector = new DbReflection();
  reflector.loadTables();
  reflector.on('tables', function(tables){
    tables.forEach(function(table){
      //log('main');
      reflector.loadTable(table);

    });
  });
  reflector.on('table', function(table){
    //log('TABLE:', table);
    var model_name = table.name;
    model_name = model_name.split(/[ _\-]+/g).map(function(part){ 
      return part.substring(0,1).toUpperCase()+part.substring(1).toLowerCase(); }).join('');

    var o = [];
    o.push("var Model = require('myorm').Model;\n\n\n");
    o.push("var "+model_name+" = exports = module.exports = function "+model_name+"() { };\n\n\n");
    o.push("Model.inherits("+model_name+");\n\n\n");
    o.push(model_name+".table = '"+table.name+"';");
    o.push(model_name+".primaryKey = "+JSON.stringify(table.primaryKey)+";");
    o.push(model_name+".columns = {");

    table.columns.forEach(function(column){
      var c = [];
      // in SQL column comment can be javascript type defined explicitly 
      var comment = column.comment.match(/^(String|Number|Boolean|Object|Date|JSON)[:\- ]*(.*)?/i);
      if(comment) {
        c.push("type: "+comment[1]);

        switch(comment[1].toLowerCase()) {
          case 'boolean':
            if(column.default_value) column.default_value = (parseInt(column.default_value) != 0);
            break;
          case 'number':
          case 'integer':
            if(column.default_value) column.default_value = parseFloat(column.default_value);
            break;
        }

        comment = comment[2];
      } else {
        comment = column.comment
        switch(column.type) {
          case 'varchar':
          case 'char':
            c.push("type: String");
            c.push("length: "+column.length);
            break;

          case 'text':
            c.push("type: String");
            break;

          case 'int':
          case 'bigint':
          case 'smallint':
          case 'tinyint':
            c.push("type: 'Integer'");
            if(column.default_value) column.default_value = parseInt(column.default_value);
            break;

          case 'double':
          case 'float':
            c.push("type: Number");
            if(column.default_value) column.default_value = parseFloat(column.default_value);
            break;

          case 'datetime':
          case 'timestamp':
          case 'date':
            c.push("type: Date");
            break;

          default:
            c.push("type: '"+column.type+"'");
        }
      }

      log(column);

      if(!column.isnull)
        c.push("notNull: true");

      if(column.default_value !== null)
        c.push("defaultValue: "+JSON.stringify(column.default_value));

      c.push("sqlType: "+JSON.stringify(column.sql_type));

      if(column.extra === 'auto_increment')
        c.push("autoIncrement: true");

      if(comment)
        c.push("comment: "+JSON.stringify(comment));
      o.push("  "+column.name+": { "+c.join(', ')+' },');
    });

    o.push("};");

    o.push("\n\n\n"+model_name+".init();");

    var content = o.join('\n');

    out(content);

    try {
      fs.writeFileSync('./tmp/'+table.name.toLowerCase()+'.js', content, 'utf8');
    } catch(err) {
      log(err);
    }

  });
};


if(require.main === module) {
  log = console.error.bind(console);
/*
  var cmd = require('commander');
  cmd.command('exec <cmd>');
  cmd.action(function(){
   console.log('echo'+cmd+'> /var/www/test.orm');
  });
  cmd.parse('exec "%S"',o.join('\n'));
*/

  main();
}