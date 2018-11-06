"use strict";

// #region DB config

function configureConnection(serverAddress, dbAlias) {
  const JDBC = require("jdbc");
  const jinst = require("jdbc/lib/jinst");

  // isJvmCreated will be true after the first java call.  When this happens, the
  // options and classpath cannot be adjusted.
  if (!jinst.isJvmCreated()) {
    // Add all java options required by your project here.  You get one chance to
    // setup the options before the first java call.
    jinst.addOption("-Xrs");
    // Add all jar files required by your project here.  You get one chance to
    // setup the classpath before the first java call.
    jinst.setupClasspath(["./drivers/hsqldb.jar"]);
  }

  const address = `${serverAddress}${
    serverAddress.endsWith("/") ? "" : "/"
  }${dbAlias}`;

  const config = {
    // Required
    // url: "jdbc:hsqldb:hsql://localhost/pcdb",
    url: `jdbc:hsqldb:${address}`,

    // Optional
    // drivername: "my.jdbc.DriverName",
    // drivername: "org.hsqldb.jdbc.JDBCDriver",
    // drivername: "org.hsqldb.jdbcDriver",
    // minpoolsize: 10,
    // maxpoolsize: 100,

    // Note that if you sepecify the user and password as below, they get
    // converted to properties and submitted to getConnection that way.  That
    // means that if your driver doesn't support the 'user' and 'password'
    // properties this will not work.  You will have to supply the appropriate
    // values in the properties object instead.
    user: "SA",
    password: "",
    properties: {}
  };

  var hsqldb = new JDBC(config);

  hsqldb.initialize(function(err) {
    if (err) {
      console.log(`DB connection error: ${err}`);
    }
  });

  return hsqldb;
}

// #endregion DB config

// #region connection handling

async function openConnectionAsync(db) {
  return new Promise(openConnectionExecutor);

  function openConnectionExecutor(resolve, reject) {
    db.reserve(function(err, connObj) {
      // The connection returned from the pool is an object with two fields
      // {uuid: <uuid>, conn: <Connection>}
      if (connObj) {
        console.log("Using connection: " + connObj.uuid);
        // Grab the Connection for use.
        const conn = connObj.conn;
        resolve(connObj);
      } else {
        reject(err);
      }
    });
  }
}

async function closeConnectionAsync(db, connObj) {
  return new Promise(closeConnectionExecutor);

  function closeConnectionExecutor(resolve, reject) {
    let hadError = false;
    // Release the connection back to the pool.
    db.release(connObj, function(err) {
      if (err) {
        console.log(
          `Had DB error while releasing the connection: [${err.message}]`
        );
        hadError = true;
        reject(err);
        return;
      }

      resolve();
    });

    if (!hadError) {
      resolve();
    }
  }
}

// #endregion connection handling

// #region execute statements

// #region query

// TODO: Now that inserts/updates use similar
// functionality, consider refactoring.
async function query(db, sqlStatement) {
  let connObj = undefined;
  try {
    connObj = await openConnectionAsync(db);
  } catch (err) {
    console.log(`DB error while opening connection. error:[${err}]`);
    throw err;
  }

  let queryError = undefined;

  let results = undefined;
  try {
    results = await executeQueryAsync(connObj, sqlStatement);
  } catch (err) {
    queryError = err;
    console.log(
      `DB error while executing query. sql:[${sqlStatement}] error:[${err}]`
    );
  }

  await closeConnectionAsync(db, connObj);

  if (queryError) {
    throw queryError;
  }

  return results;
}

// TODO: Consider refactoring to merge commonalities with insert/update.
async function executeQueryAsync(connObj, sqlStatement) {
  return new Promise(executeQueryExecutor);

  function executeQueryExecutor(resolve, reject) {
    connObj.conn.createStatement(function(err, statement) {
      if (err) {
        reject(err, "createStatement");
        return;
      }

      // Adjust some statement options before use.  See statement.js for
      // a full listing of supported options.
      statement.setFetchSize(100, function(err) {
        if (err) {
          reject(err, "setFetchSize");
          return;
        }

        // statement.executeQuery("SELECT * FROM owners;", function(
        statement.executeQuery(sqlStatement, function(err, resultset) {
          if (err) {
            reject(err, "executeQuery: select");
            return;
          }

          resultset.toObjArray(function(err, results) {
            if (results.length > 0) {
              console.log(
                `${
                  results.length
                } records returned for query: [${sqlStatement}]`
              );
            }
            // release();
            resolve(results);
          });
        });
      });
    });
  }
}

// #endregion query

// #region update

async function insert(db, sqlStatement) {
  return await update(db, sqlStatement);
}

async function update(db, sqlStatement) {
  const connObj = await openConnectionAsync(db);

  let queryError = undefined;

  let results = undefined;
  try {
    results = await executeUpdateAsync(connObj, sqlStatement);
  } catch (err) {
    queryError = err;
    console.log(
      `DB error while executing update. sql:[${sqlStatement}] error:[${err}]`
    );
  }

  await closeConnectionAsync(db, connObj);

  if (queryError) {
    throw queryError;
  }

  return results;
}

async function executeUpdateAsync(connObj, sqlStatement) {
  return new Promise(executeQueryExecutor);

  function executeQueryExecutor(resolve, reject) {
    connObj.conn.createStatement(function(err, statement) {
      if (err) {
        reject(err, "createStatement");
        return;
      }

      // Adjust some statement options before use.  See statement.js for
      // a full listing of supported options.
      statement.setFetchSize(100, function(err) {
        if (err) {
          reject(err, "setFetchSize");
          return;
        }

        // statement.executeQuery("SELECT * FROM owners;", function(
        statement.executeUpdate(sqlStatement, function(err, count) {
          if (err) {
            reject(err, "executeQuery: update");
            return;
          }

          if (count > 0) {
            console.log(
              `${count} records updated for query: [${sqlStatement}]`
            );
          }
          // release();
          resolve(count);
        });
      });
    });
  }
}

// #endregion update

// #endregion execute statements

const DB = {
  configureConnection,

  openConnectionAsync,
  closeConnectionAsync,

  query,
  insert,
  update
};
exports.default = DB;
// export default DB;
