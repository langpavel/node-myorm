var Model = require('../../.').Model;


function Entity() {};
Model.inherits(Entity);
exports = module.exports = Entity;


Entity.table = 'SESSION';
Entity.primaryKey = ['id'];
Entity.columns = {
  id: { type: 'Integer', notNull: true, sqlType: "int(11)", autoIncrement: true },
  id2: { type: Number, notNull: true, sqlType: "double" },
  str50: { type: String, length: 50, notNull: true, sqlType: "varchar(50)", comment: "text data varchar 50" },
  bool_null: { type: Boolean, sqlType: "tinyint(4)" },
  bool: { type: Boolean, notNull: true, defaultValue: false, sqlType: "tinyint(4)" }
};
