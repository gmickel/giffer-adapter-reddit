'use strict';
var test = require('tap').test;
var Adapter = require('../index');

test('Test functionality of adapter', function(t) {
  var instance = new Adapter({});
  t.ok(instance);

  // test start and stop functions
  t.end();
});

test('Test start of adapter', function(t) {
  var instance = new Adapter({
    'subreddit': 'funnygifs',
    'sorting': 'hot',
    'limit': 100,
    'max_attempts': 5,
    'poll_interval': 5000,
    'items_to_get': 2000,
    'image_types': 'gif'
  });
  instance.start();
  instance.on('gif', function(url, metadata) {
    console.log('url', url);
    console.log('origin', metadata.origin)
    t.ok(url);
    t.ok(metadata);
    t.ok(metadata.origin);
    instance.stop();
    t.end();
  });
  t.end();
});