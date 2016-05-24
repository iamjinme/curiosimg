'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Last = new Schema({
  term: String,
  when: Date
});

module.exports = mongoose.model('Last', Last);
