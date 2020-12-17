

module.exports = app => {
    const coaches = require("../controllers/coaches.controller.js");
    
    // Create a new Customer
    app.post("/coaches",coaches.validate('create'), coaches.create);
  
    // Retrieve all coaches
    app.get("/coaches", coaches.findAll);
  
    // Retrieve a single Customer with customerId
    app.get("/coaches/:coachId",coaches.validate('findOne'), coaches.findOne);
  
    // Update a Customer with customerId
    app.put("/coaches/:coachId",coaches.validate('update'), coaches.update);
  
    // Delete a Customer with customerId
    app.delete("/coaches/:coachId",coaches.validate('delete'), coaches.delete);
  
    // Create a new Customer
    app.delete("/coaches", coaches.deleteAll);
  };