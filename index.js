var ActorDBClient = require('./lib/actordb_client');
var ActorDBPool = require('./lib/actordb_pool');

connectSingle = function(connection_config) {
  return new ActorDBClient(connection_config);
};

connectionPool = function(connection_config, pool_config) {
  return new ActorDBPool(connection_config, pool_config);
}

exports.connectSingle = connectSingle;
exports.connectionPool = connectionPool;
