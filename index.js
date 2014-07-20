'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var reddit = require('redwrap');
var _ = require('lodash');

inherits(Adapter, EventEmitter);

function Adapter(config) {
  this.config = config;
}

Adapter.prototype.start = function() {
  this.emit('start');
  var self = this;
  // emits an event for every page grabbed
  reddit.r(this.config.subreddit).sort(this.config.sort).all(function(res) {
    res.on('data', function(data, res) {
      //console.log(data); //a parsed javascript object of the requested data
      //console.log(res); //the raw response data from Reddit
      var results = data.data.children;
      _.forEach(results, function(post) {
        console.log(post.data.url);
        self.emit('gif', post.data.url);
      });
    });

    res.on('error', function(e) {
      console.log('Errors' + e); //outputs any errors
    });

    res.on('end', function() {
      console.log('All Done');
    });
  });
};


Adapter.prototype.stop = function() {
  this.emit('stop');
  // stop grabbing gifs
};

module.exports = Adapter;
