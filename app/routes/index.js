'use strict';

var ImgSearch = require(process.cwd() + '/app/controllers/imgSearch.server.js');

module.exports = function (app) {
  
  var imgSearch = new ImgSearch();
  
  app.route('/')
      .get(function (req, res) {
          res.sendFile(process.cwd() + '/public/index.html');
      });

  app.route('/api/search/latest')
      .get(function (req, res) {
          res.send('Latest...');
      });

  app.route('/api/search/:term')
      .get(imgSearch.getSearch);      
};
