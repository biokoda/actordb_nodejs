var Thrift = require("thrift");
var ADBClient = require("./thrift/Actordb");
var ADBTypes = require("./thrift/adbt_types");
var EventEmitter = require("events").EventEmitter;
var util = require('util');
var Promise = typeof global.Promise == 'function' ? global.Promise : require('es6-promise').Promise;

function ActorDBClient( connect_params ) {
  var self = this;
  EventEmitter.call(this);
  self.hostname = connect_params['host'];
  self.port = connect_params['port'];
  self.username = connect_params['username'];
  self.password = connect_params['password'];
  self.connection = null;
  self.client = null;
  self.connected = false;
}

util.inherits(ActorDBClient, EventEmitter);

ActorDBClient.prototype.connect = function(connect_callback) {
  var self = this;
  if(typeof connect_callback != 'function') {
    return new Promise(function(resolve, reject) {
        self.connect(function(err, db) {
          if(err) return reject(err);
          resolve(db);
        });
      });
  }
  if (self.connected != true) {
    self.connection = Thrift.createConnection(self.hostname, self.port);
    self.connection.on("close",function(e){
      self.connection.end();
      self.connected = false;
      self.connection.removeAllListeners();
    });
    self.connection.on("timeout",function(e){
      self.connection.end();
      self.connected = false;
      self.connection.removeAllListeners();
      setTimeout(self.reconnect, 1000, self);
    });
    self.connection.on("error",function(e){
      self.connection.end();
      self.connected = false;
      self.connection.removeAllListeners();
      setTimeout(self.reconnect, 1000, self);
    });
    self.connection.on("connect",function(e){
      self.client = Thrift.createClient(ADBClient, self.connection);
      self.client.login(self.username, self.password, function(err, db){
        self.connected = true;
        connect_callback(err, db);
      });
    });
  } else {
    connect_callback({error:'Already connected'},null);
  }
}

ActorDBClient.prototype.reconnect = function(ref) {
  var self = ref;
  if (!self.connected) {
    self.connect();
  }
}

ActorDBClient.prototype.actor_types = function( callback ) {
  var ref = this;
  if(typeof callback != 'function') {
    return new Promise(function(resolve, reject) {
      ref.actor_types(function(error2,data2){
        if(error2) return reject(error2);
        resolve(data2);
      })
    });
  }
  if (!ref.connected) { callback({error:'Not Connected'},null); return; };
  this.client.actor_types(function(err,data){
    callback(err,data);
  });
}

ActorDBClient.prototype.actor_tables = function(actor_type, callback ) {
  var ref = this;
  if(typeof callback != 'function') {
    return new Promise(function(resolve, reject) {
      ref.actor_tables(actor_type,function(error2,data2){
        if(error2) return reject(error2);
        resolve(data2);
      })
    });
  }
  if (!ref.connected) { callback({error:'Not Connected'},null); return; };
  this.client.actor_tables(actor_type, function(err,data) {
    callback(err,data);
  });
}

ActorDBClient.prototype.actor_columns = function(actor_type, actor_table, callback ) {
  var ref = this;
  if(typeof callback != 'function') {
    return new Promise(function(resolve, reject) {
      ref.actor_columns(actor_type, actor_table,function(error2,data2){
        if(error2) return reject(error2);
        resolve(data2);
      })
    });
  }
  if (!ref.connected) { callback({error:'Not Connected'},null); return; };
  this.client.actor_columns(actor_type, actor_table, function(err,data) {
    callback(err,data);
  });
}

ActorDBClient.prototype.uniqid = function(callback) {
  var ref = this;
  if(typeof callback != 'function') {
    return new Promise(function(resolve, reject) {
      ref.uniqid(function(error2,data2){
        if(error2) return reject(error2);
        resolve(data2);
      })
    });
  }
  if (!ref.connected) { callback({error:'Not Connected'},null); return; };
  this.client.uniqid(function(err,data) {
    callback(err,data);
  });
}

ActorDBClient.prototype.salt = function(callback) {
  var ref = this;
  if(typeof callback != 'function') {
    return new Promise(function(resolve, reject) {
      ref.salt(function(error2,data2){
        if(error2) return reject(error2);
        resolve(data2);
      })
    });
  }
  if (!ref.connected) { callback({error:'Not Connected'},null); return; };
  this.client.salt(function(err,data) {
    callback(err,data);
  });
}

ActorDBClient.prototype.close = function() {
  this.connection.end();
}

ActorDBClient.prototype.exec_sql = function(sql_statement, result_callback) {
  var ref = this;
  if(typeof result_callback != 'function') {
    return new Promise(function(resolve, reject) {
      ref.exec_sql(sql_statement,function(error2,data2){
        if(error2) return reject(error2);
        resolve(data2);
      })
    });
  }
  if (!ref.connected) { result_callback({error:'Not Connected'},null); return; };
  this.client.exec_sql(sql_statement, function(error, result){
    /*_hasMore = result.rdRes.hasMore;*/
    data = ref.format_result(result);
    result_callback(error, data);
  });
}

ActorDBClient.prototype.exec_sql_param = function(sql_statement, bindingvals, result_callback) {
  var ref = this;
  if(typeof result_callback != 'function') {
    return new Promise(function(resolve, reject) {
      ref.exec_sql_param(sql_statement,bindingvals,function(error2,data2){
        if(error2) return reject(error2);
        resolve(data2);
      })
    });
  }
  if (!ref.connected) { result_callback({error:'Not Connected'},null); return; };
  bindingvals1 = ref.resolve_bindings(bindingvals);
  this.client.exec_sql_param(sql_statement, bindingvals1, function(error, result){
    /*_hasMore = result.rdRes.hasMore;*/
    data = ref.format_result(result);
    result_callback(error, data);
  });
}


ActorDBClient.prototype.exec_config = function(sql_statement, result_callback) {
  var ref = this;
  if(typeof result_callback != 'function') {
    return new Promise(function(resolve, reject) {
      ref.exec_config(sql_statement,function(error2,data2){
        if(error2) return reject(error2);
        resolve(data2);
      })
    });
  }
  if (!ref.connected) { result_callback({error:'Not Connected'},null); return; };
  this.client.exec_config(sql_statement, function(error, result){
    data = ref.format_result(result);
    result_callback(error, data);
  });
}

ActorDBClient.prototype.exec_schema = function(sql_statement, result_callback) {
  var ref = this;
  if(typeof result_callback != 'function') {
    return new Promise(function(resolve, reject) {
      ref.exec_schema(sql_statement,function(error2,data2){
        if(error2) return reject(error2);
        resolve(data2);
      })
    });
  }
  if (!ref.connected) { result_callback({error:'Not Connected'},null); return; };
  this.client.exec_schema(sql_statement, function(error, result){
    data = ref.format_result(result);
    result_callback(error, data);
  });
}

ActorDBClient.prototype.exec_single = function(actorname, actortype, sql_statement, flags, result_callback) {
  var ref = this;
  if(typeof result_callback != 'function') {
    return new Promise(function(resolve, reject) {
      ref.exec_single(actorname, actortype, sql_statement, flags,function(error2,data2){
        if(error2) return reject(error2);
        resolve(data2);
      })
    });
  }
  if (!ref.connected) { result_callback({error:'Not Connected'},null); return; };
  this.client.exec_single(actorname, actortype, sql_statement, flags, function(error, result){
    data = ref.format_result(result);
    result_callback(error, data);
  });
}

ActorDBClient.prototype.exec_single_param = function(actorname, actortype, sql_statement, flags, bindingvals, result_callback) {
  var ref = this;
  if(typeof result_callback != 'function') {
    return new Promise(function(resolve, reject) {
      ref.exec_single_param(actorname, actortype, sql_statement, flags, bindingvals, function(error2,data2){
        if(error2) return reject(error2);
        resolve(data2);
      })
    });
  }
  if (!ref.connected) { result_callback({error:'Not Connected'},null); return; };
  bindingvals1 = ref.resolve_bindings(bindingvals);
  this.client.exec_single_param(actorname, actortype, sql_statement, flags, bindingvals1, function(error, result) {
    data = ref.format_result(result);
    result_callback(error, data);
  });
}

ActorDBClient.prototype.exec_multi = function(actors, actortype, sql, flags, result_callback) {
  var ref = this;
  if(typeof result_callback != 'function') {
    return new Promise(function(resolve, reject) {
      ref.exec_multi(actors, actortype, sql, flags, function(error2,data2){
        if(error2) return reject(error2);
        resolve(data2);
      })
    });
  }
  if (!ref.connected) { result_callback({error:'Not Connected'},null); return; };
  this.client.exec_multi(actors, actortype, sql, flags, function(error, result){
    data = ref.format_result(result);
    result_callback(error, data);
  });
}

ActorDBClient.prototype.exec_all = function(actortype, sql, flags, result_callback) {
  var ref = this;
  if(typeof result_callback != 'function') {
    return new Promise(function(resolve, reject) {
      ref.exec_all(actortype, sql, flags, function(error2,data2){
        if(error2) return reject(error2);
        resolve(data2);
      })
    });
  }
  if (!ref.connected) { result_callback({error:'Not Connected'},null); return; };
  this.client.exec_all(actortype, sql, flags, function(error, result){
    data = ref.format_result(result);
    result_callback(error, data);
  });
}

ActorDBClient.prototype.format_result = function(result) {
  if (!result) {
    return { empty:1 };
  }
  if (result.rdRes) {
    /*_hasMore = result.rdRes.hasMore;*/
    _columns = result.rdRes.columns;
    _rows = [];
    for (i=0; i < result.rdRes.rows.length; i++) {
      _rows[i] = {};
      for (column in result.rdRes.rows[i]) {
        for (key in result.rdRes.rows[i][column]) {
          if (result.rdRes.rows[i][column][key] != null && key != 'isnull') {
            _rows[i][column] = result.rdRes.rows[i][column][key];
            break;
          } else if (key == 'isnull' && result.rdRes.rows[i][column][key] == true) {
            _rows[i][column] = null;
            break;
          }
        }
      }
    }
    data = { /*hasMore:_hasMore,*/ columns:_columns, rows:_rows };
  } else if (result.wrRes) {
    data = { wr:true };
  }else {
    data = { };
  }
  return data;
}

ActorDBClient.prototype.resolve_bindings = function(bindingvals) {
  resolved = [ ];
  for (i=0; i<bindingvals.length;i++) {
    resolved[i] = [ ];
    for (j=0; j<bindingvals[i].length;j++) {
      val = bindingvals[i][j];
      if (typeof val == 'number') {
        resolved[i][j] = new ADBTypes.Val({"bigint":bindingvals[i][j]});
      }
      if (typeof val == 'string') {
        resolved[i][j] = new ADBTypes.Val({"text":bindingvals[i][j]});
      }
      if (typeof val == 'boolean') {
        resolved[i][j] = new ADBTypes.Val({"bval":bindingvals[i][j]});
      }
    }
  }
  return resolved;
}

module.exports = ActorDBClient;
