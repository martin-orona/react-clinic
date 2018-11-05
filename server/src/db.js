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

async function query(db, sqlQueryStatement) {
  const connObj = await openConnectionAsync(db);

  let queryError = undefined;

  let results = undefined;
  try {
    results = await executeQueryAsync(connObj, sqlQueryStatement);
  } catch (err) {
    queryError = err;
    console.log(
      `DB error while executing query. query:[${sqlQueryStatement}] error:[${err}]`
    );
  }

  await closeConnectionAsync(db, connObj);

  if (queryError) {
    throw queryError;
  }

  return results;
}

async function executeQueryAsync(connObj, queryStatement) {
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
        statement.executeQuery(queryStatement, function(err, resultset) {
          if (err) {
            reject(err, "executeQuery: select");
            return;
          }

          resultset.toObjArray(function(err, results) {
            if (results.length > 0) {
              console.log(
                `${
                  results.length
                } records returned for query: [${queryStatement}]`
              );
              console.log("ID: " + results[0].ID);
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
// #endregion execute statements

const DB = {
  configureConnection,

  openConnectionAsync,
  closeConnectionAsync,

  query,
  executeQueryAsync
};
exports.default = DB;
// export default DB;
