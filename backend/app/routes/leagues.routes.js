module.exports = app => {
    const lookups = require("../controllers/leagues.controller.js");
  
    // get leagues
    app.get("/league", lookups.league);
  
  };