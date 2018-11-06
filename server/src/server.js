// #region DB
const DB = require("./db").default;

const hsqldb = DB.configureConnection("hsql://localhost", "pcdb");

async function queryDbAsync(sql) {
  return await DB.query(hsqldb, sql);
}

async function updateDbAsync(sql) {
  return await DB.update(hsqldb, sql);
}

async function insertDbAsync(sql) {
  return await DB.insert(hsqldb, sql);
}

async function getAllPets() {
  return await queryDbAsync(
    ` SELECT 
        P.*, 
        O.FIRST_NAME AS OWNER_FIRST_NAME,
        O.LAST_NAME AS OWNER_LAST_NAME,
        T.NAME AS TYPE_NAME
      FROM "PUBLIC"."PETS" AS P
        INNER JOIN OWNERS AS O
          ON P.OWNER_ID = O.ID
        INNER JOIN TYPES AS T
          ON P.TYPE_ID = T.ID
      ORDER BY P.NAME ASC
    `
  );
}

async function getAllVets() {
  return await queryDbAsync(
    ` SELECT *
      FROM "PUBLIC"."VETS"
      ORDER BY LAST_NAME ASC
    `
  );
}

// #endregion DB

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.get("/api/hello", async (req, res) => {
  var results = await queryDbAsync("SELECT * FROM pets;");

  res.send({
    express: `Hello From Express ${new Date().toLocaleString()}
              <br/>
              results: count: ${results.length}`
  });
});

app.post("/api/get", async (req, res) => {
  console.log("/api/pets hit");
  console.log(req.body);

  const dataType = req.body.dataType;

  var results;

  switch (dataType) {
    case "Pets":
      results = await getAllPets();
      break;

    case "Vets":
      results = await getAllVets();
      break;

    default:
      break;
  }

  res.send({
    action: "GetAll",
    dataType: dataType,
    resultCount: results.length,
    data: results
  });
});

app.post("/api/add", async (req, res) => {
  console.log("/api/add hit");
  console.log(req.body);

  const dataType = req.body.dataType;

  var results;

  switch (dataType) {
    case "Pets":
      results = await addPet(req.body.data);
      break;

    case "Vets":
      results = await addVet(req.body.data);
      break;

    default:
      break;
  }

  res.send({
    action: "GetAll",
    dataType: "Pets",
    resultCount: results.length,
    data: results
  });
});

app.get("*", function(req, res) {
  console.log("non existing route called");
  res.render("error");
});

app.listen(port, () => console.log(`Listening on port ${port}`));

async function addPet(pet) {
  // NOTE: Happy path, this will break if data trash comes through

  var typeIdResult = await queryDbAsync(
    ` SELECT * 
      FROM "PUBLIC"."TYPES" 
      WHERE NAME = '${pet.TYPE_NAME}'
    `
  );
  var typeId = typeIdResult[0].ID;

  var ownerResult = await queryDbAsync(
    ` SELECT ID, FIRST_NAME, LAST_NAME
      FROM "PUBLIC"."OWNERS"
      WHERE FIRST_NAME = '${pet.OWNER_FIRST_NAME}' 
        and LAST_NAME = '${pet.OWNER_LAST_NAME}'
    `
  );
  var ownerId = ownerResult[0].ID;

  var petResult = await queryDbAsync(
    ` SELECT * FROM "PUBLIC"."PETS"
      WHERE NAME = '${pet.NAME}' 
        and BIRTH_DATE = '${pet.BIRTH_DATE}'
        and TYPE_ID = ${typeId}
        and OWNER_ID = ${ownerId}
    `
  );

  // TODO: figure out why this is sometimes getting called many times (I suspect that it is the development environment)
  if (petResult.length <= 0) {
    var maxIdResult = await queryDbAsync(
      ` SELECT MAX(ID) as ID FROM "PUBLIC"."PETS"`
    );
    var maxId = maxIdResult[0].ID;

    var addResult = await insertDbAsync(
      ` INSERT INTO "PUBLIC"."PETS"
        ( "ID", "NAME", "BIRTH_DATE", "TYPE_ID", "OWNER_ID" )
      VALUES ( ${maxId + 1}, '${pet.NAME}', '${
        pet.BIRTH_DATE
      }', ${typeId}, ${ownerId} )
  `
    );
  }

  var results = await getAllPets();
  return results;
}

async function addVet(vet) {
  // NOTE: Happy path, this will break if data trash comes through
  try {
    var vetResult = await queryDbAsync(
      ` SELECT * FROM "PUBLIC"."VETS"
      WHERE FIRST_NAME = '${vet.FIRST_NAME}' 
        and LAST_NAME = '${vet.LAST_NAME}'
    `
    );

    // TODO: figure out why this is sometimes getting called many times (I suspect that it is the development environment)
    if (vetResult.length <= 0) {
      var maxIdResult = await queryDbAsync(
        ` SELECT MAX(ID) as ID FROM "PUBLIC"."VETS"`
      );
      var maxId = maxIdResult[0].ID;

      var addResult = await insertDbAsync(
        ` INSERT INTO "PUBLIC"."VETS"
            ( "ID", "FIRST_NAME", "LAST_NAME" )
          VALUES 
            ( ${maxId + 1}, '${vet.FIRST_NAME}', '${vet.LAST_NAME}' )
        `
      );
    }
  } catch (err) {
    console.log(
      `${new Date().toLocaleTimeString()}: error during add vet: ${err}`
    );
  }

  try {
    var results = await getAllVets();
    return results;
  } catch (err) {
    console.log(
      `${new Date().toLocaleTimeString()}: error during retrievent all vets after add attempt: ${err}`
    );
    return [];
  }
}
