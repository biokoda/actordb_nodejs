# ActorDB connector for Node.js


# Installation

The recommended way to get started using the ActorDB connector for Node.js is by using the `npm` (Node Package Manager) to install the dependency.

`npm install actordb`

## ActorDBClient Interface

### Create a single connection to database

```
var ActorDB = require('actordb');
var adbc = ActorDB.connectSingle({ host:'localhost', port:33306, username:"<username>", password:"<password>" });
adbc.connect().then(function(db){
    // connected code ...
  });
```

### Close a single connection

```
adbc.close();
```

### Create a pool of connections to database

```
var ActorDB = require('actordb');
var adbc_pool = ActorDB.connectionPool({ host:'localhost', port:33306, username:"<username>", password:"<username>" }, { pool_size : 5 });
adbc_pool.connect().then(function(){
  // fetch a ActorDBClient instance
  adbc = adbc_pool.db();
  // execute actions like on a single connection
  adbc.exec_sql(...)
});  
```

### Close a pool of connections

### Executing SQL statement

```
adbc.exec_sql("ACTOR user(myid1); SELECT * FROM contact;").then(function(result){
  // work with the result set
  console.log(result);
});
```

### Executing a single SQL statement with parameters

```
client1.exec_single_param("myuserid", "user", "INSERT INTO contact (contact_id, contact_name) VALUES (?1,?2);", [ 'CREATE' ], [ ["contact_id", "contact_name"] ] ).then(function(result) {
  // work with the result set
  console.log(result);
}).catch(function(err){
  // handle error
  console.log(err);
});

```

### Fetching Unique ID

```
client1.uniqid().then(function(uniqid){
  console.log("uniqid:");
  console.log(uniqid);
});
```
### Fetching DB generated salt

```
client1.salt().then(function(salt){
  console.log("salt:");
  console.log(salt);
});
```

### Executing a single SQL statement

```
client1.exec_single("myuserid123", "user","INSERT INTO contact (contact_id, is_deleted) VALUES ('lolek',0);",[ 'CREATE' ]).then(function(result){
  console.log("insert2 query result:");
  console.log(result);
}).catch(function(err){
  console.log("insert2 query error:");
  console.log(err);
});
```

### Fetching all Actor types

```
adbc.actor_types().then(function(types){
  // work with actor types
  console.log(types);
});
```

### Fetching all Tables for an Actor Type

```
adbc.actor_tables("actor_type").then(function(actor_tables){
  // work with table list
  console.log(actor_tables);
});
```

### Fetching all columns for a Table within an Actor Type

```
client1.actor_columns("user", "contact").then(function(column_list){
  // work with column list
  console.log(column_list);
});
```

## Example usage

### Connecting through a single connection and performing a query

```
var ActorDB = require('actordb');
var client = ActorDB.connectSingle({ host:'localhost', port:33306, username:"actordb_username", password:"actordb_password" });

client.connect(function(err, db) {
    client.exec_sql("ACTOR user(userid1); SELECT * FROM data;", function(err,data){
    client.close();
    console.log(data);
    });  
});
```

### Setting up a pool of connections and performing a query

```
var ActorDB = require('actordb');
var pool = ActorDB.connectionPool({ host:'localhost', port:33306, username:"actordb_username", password:"actordb_password" }, { pool_size : 3 });

pool.connect().then(function(){
  pool.db().exec_sql("ACTOR user(userid1); SELET * FROM data;").then(function(r){
    console.log(r);
    pool.close();
  });
});
```

## Questions / Feature Requests / BUgs

Are you missing something out? Have you found a bug? Want to discuss something or help with the project?

Please open an issue or pull request on GitHub:

- [ActorDB node.js connector issues](https://github.com/biokoda/actordb_nodejs/issues)
- [ActorDB nodejs pull requests](https://github.com/biokoda/actordb_nodejs/pulls)

## Next Steps

 * [ActorDB Documentation](http://www.actordb.com/)
 * [Star us on GitHub](https://github.com/biokoda/actordb_nodejs)
