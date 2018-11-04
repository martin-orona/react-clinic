var hsqldb = setupDbConnection();

const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.get("/api/hello", (req, res) => {
  callDb(results => {
    res.send({
      express: `Hello From Express ${new Date().toLocaleString()}
                <br/>
                results: count: ${results.length}`
    });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

function callDb(resultHandler) {
  hsqldb.reserve(function(err, connObj) {
    // The connection returned from the pool is an object with two fields
    // {uuid: <uuid>, conn: <Connection>}
    if (connObj) {
      console.log("Using connection: " + connObj.uuid);
      // Grab the Connection for use.
      const conn = connObj.conn;

      function release() {
        // Release the connection back to the pool.
        hsqldb.release(connObj, function(err) {
          if (err) {
            console.log(
              `Had DB error while releasing the connection: [${err.message}]`
            );
          }
        });
      }

      function hadError(err, operation) {
        console.log(
          `Had DB error. operation:[${operation}] error:[${err.message}]`
        );
        release();
      }

      conn.createStatement(function(err, statement) {
        if (err) {
          hadError(err, "createStatement");
        } else {
          // Adjust some statement options before use.  See statement.js for
          // a full listing of supported options.
          statement.setFetchSize(100, function(err) {
            if (err) {
              hadError(err, "setFetchSize");
            } else {
              statement.executeQuery("SELECT * FROM owners;", function(
                err,
                resultset
              ) {
                if (err) {
                  hadError(err, "executeQuery: select");
                } else {
                  resultset.toObjArray(function(err, results) {
                    if (results.length > 0) {
                      console.log("ID: " + results[0].ID);
                    }
                    release();
                    resultHandler(results);
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

function setupDbConnection() {
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

  var config = {
    // Required
    url: "jdbc:hsqldb:hsql://localhost/pcdb",

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
