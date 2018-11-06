This is a UI for the Spring PetClinic backend.

## How to generate project

This is a sequence of steps taken to generate this project. I'm saving it for posterity.

### Create the initial project

This project uses [react-scripts-ts](https://github.com/wmonk/create-react-app-typescript#tldr) to create a [React](https://reactjs.org/) app that uses [TypeScript](https://www.typescriptlang.org/) for easier project management over time; especially as a project gets larger or is maintained by multiple people.

```sh
npx create-react-app react-clinic --scripts-version=react-scripts-ts
```

### Organize the project into a Client and Server

Since I know that this project will have a React front end and a server backend, it is helpful to organize the code accordingly.

The initial intent is the have the Express node server backend talk to the DB or proxy to the Java backend.

The article [How to get create-react-app to work with a Node.js back-end API](https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0) walks through the steps.

#### Create the app

Done in [Create the initial project](#create-the-initial-project).

#### Create the client directory

```sh
mkdir client
```

#### Move the React content into the Client directory

I moved over the directories: `public, src`.

I moved over the files: `images.d.ts, package.json, ackage-lock.json, tsconfig.json, tsconfig.prod.json, sconfig.test.json, tslint.json, README.md`.

I copied over the files: `.gitignore`.

I didn't move `node_modules`. Some of the content already n it will be useful to have at the root level.

I ran the following commands to download any required ackages:

```sh
cd client
npm install
```

I ran the following command to make sure the client app orked.

```sh
npm start
```

#### Create the server

I ran the following commands to create the server irectory:

```sh
## move out of the client directory if necessary
cd ..
mkdir server
cd server
```

I created `server.js` as a place holder to have a server o initially test that the client can talk to the server. he content is:

```js
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.get("/api/hello", (req, res) => {
  res.send({ express: `Hello From Express ${new Date().toLocaleString()}` });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
```

I copied over `.gitignore`.

I created `package.json` with the following configuration:

```js
{
  "name": "react-clinic-server",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "server": "nodemon server.js",
    "start": "npm run server"
  },
  "dependencies": {
    "express": "^4.16.2"
  },
  "devDependencies": {
    "nodemon": "^1.18.4"
  }
}
```

I ran the following commands to download any required packages:

```bash
npm install
```

I ran the following command to make sure the server app worked.

```sh
npm start
```

I verified that it worked by pointing my browser at http://localhost:5000/api/hello.

#### Create root entry poing

I created `package.json` with the following configuration:

```js
{
  "name": "react-clinic-client-and-server",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "client": "cd client && npm start",
    "server": "cd server && npm start",
    "dev": "concurrently --kill-others-on-fail \"npm run server\" \"npm run client\"",
    "start": "npm run dev"
  },
  "dependencies": {},
  "devDependencies": {
    "concurrently": "^3.5.0"
  }
}
```

I added the following line to the client's `package.json`:

```js
"proxy": "http://localhost:5000/"
```

It makes life a little easier. Calling the server with `fetch('/api/hello')` is easier than with `fetch('http://localhost:5000/api/hello')` or `fetch('${ServerAddress}/api/hello')`. Configuring the server's address in the client's config file is easier for now.

I added `LICENSE` per Github recommendation.

I ran the following commands to download any required packages:

```sh
## move up to the root directory if necessary
cd ..
npm install
```

#### Integrate the Client to the Server

I added the following code to the `App` component in `App.tsx`; it calls the server and proves interoperability:

```ts
  public state = { response: "" };

  public componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      // tslint:disable-next-line:no-console
      .catch(err => console.log(err));
  }

  public callApi = async () => {
    const response = await fetch("/api/hello");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  };

  public Api = async () => {
    const response = await fetch("/api/hello");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  };
```

I added the following to `render()`; to show visual proof of connectivity to server:

```ts
<p>{this.state.response}</p>
```

I ran the following command to make sure the server app worked.

```sh
npm start
```

I verified that the client and server worked togerther by seeing the client pop up in my browser and the message from the server displayed in the page. I hit refresh to see the changing timestamp to prove that it wasn't a "hard coded" value.

## How to get DB running

I used the article [How to query HyperSQL database from C#](http://nikolaiklimov.de/query-java-HyperSQL-database-with-csharp/) as a reference for getting HyperSQL to run. I looked up this article because C# is the development environment that I'm currently most practiced in.

I downloaded the latest version of HyperSQL Database Engine (HSQLDB) from https://sourceforge.net/projects/hsqldb/files/.

**Note**: assume a base path for the following DB content, e.g. `D:\dev\Intuit\petclinic-db`.

I extracted the HSQLDB content to directory `hsqldb-2.4.1`.

I created directory `database` to hold HSQLDB database files.

I copied the the Spring PetClinic database scripts into directory `db-scripts` from source directory `src\main\resources\db\hsqldb`.

I ran the HSQLDB server via command line:

```sh
java -cp .\hsqldb-2.4.1\hsqldb\lib\hsqldb.jar org.hsqldb.server.Server ? --database.0 file:database\petclinicdb --dbname.0 pcdb

# running in file mode so that the data may persist across mishaps/reboots
# the HSQLDB DB files will go to directory database and have names starting with petclinicdb
# when connecting to the database server, the database alies will be pcdb
```

I ran the HSQLDB UI:

```sh
.\hsqldb-2.4.1\hsqldb\lib\hsqldb.jar
```

I tried to run the `schema.sql` script but kept getting the error message `user lacks privilege or object not found: VETS / Error Code: -5501 / State: 42501`. When running the SQL statements from the built in command `Test Script`, I didn't get the error.

I prepended the test script SQL statements to the beginning of `schema.sql` and executed its content; with success. I then executed `data.sql` and got data into the database.

### Proving that the Express web server can talk to the DB

I added a Node.js DB driver:

```sh
cd server
npm install --save jdbc
```

I added connection setup and SQL select statement call to `server.js` based on the [node-jdbc](https://github.com/CraZySacX/node-jdbc) documentation.

I got errors.

I created a `drivers` folder to house the JDBC drivers needed to talk to the DB.

I copied `hsqldb.jar` to `drivers` from `hsqldb-2.4.1\hsqldb\lib`.

I ran the server with no errors.

I verified that it worked by pointing my browser at http://localhost:5000/api/hello.

The data result count was 0.

I ran the `data.sql` script. I refreshed the page. This time the result count was higher than 0; success.

## Refactoring the DB API

I refactored the DB API to make it "simple" to use in code. I started with refactoring from the callback pattern to the Promise pattern; then I refactored to async/await pattern.

## Getting a UI going

I decided to try using an existing UI component library, the first to come to mind was Google's Material Design, which is designed to work on large and small screens.

I installed some packages:

```sh
npm install --save @material-ui/core
npm install --save typeface-roboto
npm install --save @material-ui/icons
```

### Adding Redux for app state management

```sh
# app state management
npm install --save redux
# integration with React
npm install --save react-redux
npm install --save-dev @types/react-redux
# help with async actions
npm install --save redux-thunk
# help with marging state
npm install --save lodash
npm install --save-dev @types/lodash
```

### Passing data between client and server

Apparently Express no longer supports parsing body content by default.

In the `server` directory :

```sh
npm install --save body-parser
```

### Adding a fancy grid

I looked at the default Material Design table and it is ok, but it doesn't offer a lot of the functionality that is usually desired from a grid. The React documentation pointed to the DevExpress grid, so I went with it.

In the `client` directory:

```sh
npm install --save @devexpress/dx-react-core @devexpress/dx-react-grid
npm install --save @devexpress/dx-react-grid-material-ui
```

It was a major pain to get it to work, probably because complex tools are complex.

Once I got the grid working, I integrated its ability to add a record (here in the form of adding a pet).

## Added Vets

I added a screen to view and add Vets.

**BUG:** I noticed an odd behavior where the Vets screen is calling the server a lot more than the Pets screen; event though the Vets screen is based very heavily on the Pets screen and accompanying code.

**BUG:** I also noticed that when adding a Vet to the DB, while the record is added successfully, the response doesn't come back to the UI to trigger an update with the new data. My gut says that it is a bug with the server code or with the high number of calls that the React client makes for the same UI trigger. An F5 refresh shows the data as expected.

## Added pet appointments

I added the ability to view and add apointments to the Pet screen by expanding the pet row.

**BUG** I noticed that like the Vets, pet appointments do not cause an appropriate screen refresh with new data. Additionally once an appointment is added, the child/detail UI gets "stuck" and shows the same data no matter what pet row is expanded. Oddly, inspecting the state of the React components, they have the update records. An F5 refresh shows the data as expected; and the child/detail UI goes back to working normally.
