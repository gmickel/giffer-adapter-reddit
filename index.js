'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var rawjs = require('raw.js');
var redditConfig = require('./config');
var reddit = new rawjs(redditConfig.reddit.userAgent);
reddit.setupOAuth2(redditConfig.reddit.consumerKey, redditConfig.reddit.consumerSecret);

inherits(Adapter, EventEmitter);

function Adapter(config) {
  this.subreddit = config.subreddit || 'funny';
  this.sorting = config.sorting || 'hot';
  this.limit = config.limit || 100;
  this.max_attempts = config.max_attempts || 5;
  this.poll_interval = config.poll_interval || 5000;
  this.items_to_get = config.items_to_get || 1000;
  this.running = true;
  this.image_types = config.image_types || '(gif|jpg|jpeg|png)';
  this.re = new RegExp('https?:\/\/.*\\.' + this.image_types + '', 'i');
  EventEmitter.call(this);
}

Adapter.prototype.start = function() {
  this.emit('start');
  return this.getItems();
};


Adapter.prototype.stop = function() {
  this.emit('stop');
  this.running = false;
};

/* TODO: implement attempts, error handling, permanent token / refresh token */
Adapter.prototype.getItems = function(item_count, after, attempt) {
  var self = this;
  item_count = typeof item_count !== 'undefined' ? item_count : 0;
  after = typeof after !== 'undefined' ? after : '';
  attempt = typeof attempt !== 'undefined' ? attempt : 1;

  reddit[self.sorting]({
    'r': self.subreddit,
    'limit': 100,
    'after': after
  }, function(err, response) {
    if (err) {
      console.log('Error: ' + err);
    } else {
      var results = response.children;
      item_count += results.length;
      results.forEach(function(post, index) {
        if (post.data.url.match(self.re)) {
          self.emit('gif', post.data.url);
        }
        if (index == results.length - 1) {
          if (item_count < self.items_to_get && self.running) {
            setTimeout(function() {
              self.getItems(item_count, post.data.name);
            }, self.poll_interval);
          } else {
            // max items reached, start from the first page again
            if (self.running) {
              setTimeout(function() {
                self.getItems();
              }, self.poll_interval);
            }
          }
        }
      });
    }
  });
};

module.exports = Adapter;
