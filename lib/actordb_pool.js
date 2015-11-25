var ActorDBClient = require('./actordb_client');
var EventEmitter = require("events").EventEmitter;
var util = require('util');

function ActorDBPool( connect_params, pool_params ) {
  var self = this;
  EventEmitter.call(this);
  self.config = connect_params;
  self.pool_size = pool_params['pool_size'];
  self.pool = [ ];
  self.next_client = 0;
  self.connected = false;
}

util.inherits(ActorDBPool, EventEmitter);

ActorDBPool.prototype.connect = function(callback) {
  var self = this;
  if(typeof callback != 'function') {
    return new Promise(function(resolve, reject) {
      self.connect(function(err,ok){
        if(err) return reject(err);
        resolve(ok);
      })
    });
  }
  if (self.connected) { callback({error:'Pool already connected'},null); return; }
  self.connected = true;
  for (i=0; i < self.pool_size; i++) {
    var adbc = new ActorDBClient(self.config);
    self.pool[i] = adbc;
    adbc.connect();
  }
  callback(null,true);
}

ActorDBPool.prototype.db = function() {
  var self = this;
  if (!self.connected) return null;
  self.next_client = (self.next_client + 1) % self.pool_size;
  client = self.pool[self.next_client];
  return client;
}

ActorDBPool.prototype.close = function() {
  var self = this;
  for (i=0; i<self.pool[i];i++) {
    adbc = self.pool[i];
    adbc.close();
  }
  self.connected = false;
}

module.exports = ActorDBPool;
