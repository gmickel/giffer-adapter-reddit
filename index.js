'use strict';
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var redditConfig = require('./config');
//var reddit = require('redwrap');
var Snoocore = require('snoocore');

var reddit = new Snoocore({
  userAgent: this.userAgent,
  throttle: this.throttle
});

// Authenticate with Reddit
var authData = Snoocore.oauth.getAuthData('script', {
  consumerKey: redditConfig.reddit.consumerKey,
  consumerSecret: redditConfig.reddit.consumerSecret,
  username: redditConfig.reddit.username,
  password: redditConfig.reddit.password,
  scope: 'read' // scopes you want to use!
});

reddit.auth(authData);


inherits(Adapter, EventEmitter);

function Adapter(config) {
  this.subreddit = config.subreddit || 'funny';
  this.sorting = config.sort || 'hot';
  this.limit = config.limit || 100;
  this.max_attempts = config.max_attempts || 5;
  this.poll_interval = config.poll_interval || 5000;
  this.userAgent = config.userAgent;
  this.throttle = config.throttle;
  this.items_to_get = config.items_to_get || 1000;
  EventEmitter.call(this);
}

Adapter.prototype.start = function() {
  this.emit('start');
  return this.getItems();
};


Adapter.prototype.stop = function() {
  // TODO: implement stop
  this.emit('stop');
  // stop grabbing gifs
};

/* TODO: implement attempts, error handling, permanent token / refresh token */
Adapter.prototype.getItems = function(item_count, after, attempt) {
  var self = this;
  item_count = typeof item_count !== 'undefined' ? item_count : 0;
  after = typeof after !== 'undefined' ? after : '';
  attempt = typeof attempt !== 'undefined' ? attempt : 1;

  reddit.raw('http://www.reddit.com/r/$subreddit/$sorting/.json').get({
    $subreddit: self.subreddit,
    $sorting: 'new',
    limit: self.limit,
    after: after
  }).then(function(response) {
    var results = response.data.children;
    item_count += results.length;
    results.forEach(function(post, index) {
      // if (post.data.url.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg))/i)) {
      if (post.data.url.match(/(https?:\/\/.*\.gif)/i)) {
        self.emit('gif', post.data.url); // TODO: send correct image type
      }
      if (index == results.length - 1) {
        if (item_count < self.items_to_get) {
          setTimeout(function() {
            self.getItems(item_count, post.data.name);
          }, self.poll_interval);
        } else {
          // max items reached, start from the first page again
          setTimeout(function() {
            self.getItems();
          }, self.poll_interval);
        }
      }
    });
  }, function(error) {
    console.log(error);
  });
};

module.exports = Adapter;
