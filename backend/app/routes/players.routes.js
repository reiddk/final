module.exports = app => {
    const players = require("../controllers/players.controller.js");
  
    // Create a new player
    app.post("/players",players.validate('create'), players.create);
  
    // Retrieve all players
    app.get("/players", players.findAll);
  
    // Retrieve a single player with playerId
    app.get("/players/:playerId",players.validate('findOne'), players.findOne);
  
    // Update a player with playerId
    app.put("/players/:playerId",players.validate('update'), players.update);
  
    // Delete a player with playerId
    app.delete("/players/:playerId",players.validate('delete'), players.delete);
  
    // Create a new player
    app.delete("/players", players.deleteAll);
  };