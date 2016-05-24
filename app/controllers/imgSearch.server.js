'use strict';

var url = require("url");
var request = require('request');
var Latest = require('../models/latest.js');

function ImgSearch() {
  
  var cx_id = process.env.CX_ID;
  var api_key = process.env.API_KEY;
  
  this.countURL = function() {
    Urls.count({}, function( err, count){
      return count;
    });
  };
  
  this.saveSearch = function(term) {
    var last = { 'term': term, 'when': new Date() };
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
		Latest.findOneAndUpdate({ 'term': term }, last, options, function(err, result) {
			if (err) { return false; }
      console.log(term);
    });
  }
  
  this.getSearch = function(req, res) {
    var query = url.parse(req.url, true).query
    var offset = parseInt(query.offset || "0");
    var api_url  = 'https://www.googleapis.com/customsearch/v1/';
        api_url += '?q=' + req.params.term;
        api_url += '&searchType=image';
        api_url += '&key=' + api_key;
        api_url += '&cx=' + cx_id;
        if (offset > 0)
          api_url += '&start=' + offset;
    // Save search
    this.saveSearch(req.params.term);
    // Call API Custom Search Google
    request(api_url, function (error, response, body) {
      var items = [];
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body).items;
        for (var i in data) {
          items.push({ "url": data[i].link, 
                       "title": data[i].title, 
                       "thumbnail": data[i].image.thumbnailLink,
                       "context": data[i].image.contextLink
          });
        };
        res.json(items);
      };
    });
  };
  
  this.addURL = function(req, res, prefix) {
    var uri = (prefix || '') + req.params.url;
    if (!this.isURL(uri)) {
      res.json({ "error": true });
      return;
    };
    var hash = ys.hash(uri);
    var url = {
      "original": uri,
      "hash": hash
    }
    var options = { upsert: true, new: true, setDefaultsOnInsert: true };
		Urls.findOneAndUpdate({ 'hash': hash }, url, options, function(err, result) {
			if (err) { throw err; }
      res.json({ "original_url": url.original, "short_url": (process.env.API_URL || '') + url.hash });
    });
  };
  
};

module.exports = ImgSearch;
