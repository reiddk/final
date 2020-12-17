const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
const expressValidator = require('express-validator');

// parse requests of content-type: application/json
app.use(bodyParser.json());

app.use(cors());

app.use(express.static('public'));
app.use(expressValidator());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.json());
require("./app/routes/customer.routes.js")(app);
require("./app/routes/coaches.routes.js")(app);
require("./app/routes/players.routes.js")(app);
require("./app/routes/teams.routes.js")(app);
require("./app/routes/leagues.routes.js")(app);
require("./app/routes/licenses.routes.js")(app);

// set port, listen for requests
app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});