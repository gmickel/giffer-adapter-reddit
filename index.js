var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var reddit = require('redwrap');
var _ = require('lodash');

inherits(Adapter, EventEmitter);

function Adapter(config) {

}

Adapter.prototype.start = function () {
    this.emit('start');
    // start grabbing some gifs
    // and then `this.emit('gif', url)`
    reddit.r('funny').sort('hot').limit(100, function(err, data, res){
        console.log('errors:' + err);
        //console.log(data);
        /*_.forEach(data, function(post) {
            console.log(post.children);
        });*/
        for (var children in data) {
                console.log(children);
            }
    });
};

Adapter.prototype.stop = function () {
    this.emit('stop');
    // stop grabbing gifs
};

module.exports = Adapter;
