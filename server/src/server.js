const DB = require("./db").default;

const hsqldb = DB.configureConnection("hsql://localhost", "pcdb");

async function queryDbAsync(sql) {
  return await DB.query(hsqldb, sql);
}

const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.get("/api/hello", async (req, res) => {
  var results = await queryDbAsync("SELECT * FROM owners;");

  res.send({
    express: `Hello From Express ${new Date().toLocaleString()}
              <br/>
              results: count: ${results.length}`
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
