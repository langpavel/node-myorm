/*
 * This file is package main entry
 */

// imports ===================================================================
var package = require('./../package.json');
var Model = require('./model');
var columns = require('./columns');



function MyORM() {};


module.exports = exports = MyORM;



// class static constants ====================================================
MyORM.version = package.version;


// class static classes ======================================================
MyORM.Model = Model;


/// this is actually a hash containing column classes in lowercase by filename
MyORM.columns = columns;