module.exports = app => {
    const teams = require("../controllers/teams.controller.js");
  
    // Create a new Customer
    app.post("/teams",teams.validate('create'), teams.create);
  
    // Retrieve all teams
    app.get("/teams", teams.findAll);
  
    // Retrieve a single teams with teamId
    app.get("/teams/:teamId",teams.validate('findOne'), teams.findOne);
  
    // Update a team with teamId
    app.put("/teams/:teamId",teams.validate('update'), teams.update);
  
    // Delete a Customer with teamId
    app.delete("/teams/:teamId",teams.validate('delete'), teams.delete);
  
    // Create a new Customer
    app.delete("/teams", teams.deleteAll);
  };