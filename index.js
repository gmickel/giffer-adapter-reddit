'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var reddit = require('redwrap');

inherits(Adapter, EventEmitter);

function Adapter(config) {
  this.subreddit = config.subreddit || 'funny';
  this.sorting = config.sort || 'hot';
  EventEmitter.call(this);
}

Adapter.prototype.start = function() {
  this.emit('start');
  var self = this;
  // emits an data event for every page result
  reddit.r(this.subreddit).sort(this.sorting).all(function(res) {
    res.on('data', function(data, res) {
      //console.log(data); //a parsed javascript object of the requested data
      //console.log(res); //the raw response data from Reddit
      var results = data.data.children;
      results.forEach(function(post) {
        if (post.data.url.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/i)) {
          self.emit('gif', post.data.url);
        }
      });
    });

    res.on('error', function(e) {
      throw e;
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
