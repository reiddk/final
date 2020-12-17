module.exports = app => {
    const licenses = require("../controllers/licenses.controller.js");
  
    // get leagues
    app.get("/licenses", licenses.getAll);
  
  };