const Player = require("../models/players.model.js");
const { body, param } = require('express-validator/check');
const { validationResult } = require('express-validator/check');
const customValidators = require('./custom-validators.js');
const dataManip = require('../services/data-manipulation.js');

// Create and Save a new Player
exports.create = (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(422).json({errors: validationErrors.array()});
        return;
    }
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a player
    const player = new Player({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address1: req.body.address1,
        address2: req.body.address2,
        notes: req.body.notes,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        team_id: req.body.team_id,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        user_name: req.body.user_name,
        license_level_id: req.body.license_level_id,
        person_type: "player"
    });
    console.log("asdfsadfasdf", req.body);
    // Save player in the database
    Player.create(player, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the player."
        });
      else res.send(data);
    });
  };

// Retrieve all Players from the database.
exports.findAll = (req, res) => {
    Player.getAll((err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving players."
        });
      } else {
        if (req.query.is_lookup) {
          res.send(data.map(d => { return {label: `${d.first_name} ${d.last_name}`, value: d.id }}));
        } else {
          res.send(dataManip.runDataManipulation(data, req.query));
        }
      }
    });
  };

// Find a single Players with a playerId
exports.findOne = (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(422).json({errors: validationErrors.array()});
        return;
    }
    Player.findById(req.params.playerId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Player with id ${req.params.playerId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Player with id " + req.params.playerId
          });
        }
      } else res.send(data);
    });
  };

// Update a Player identified by the playerId in the request
exports.update = (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(422).json({errors: validationErrors.array()});
        return;
    }
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    Player.updateById(
      req.params.playerId,
      new Player(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Player with id ${req.params.playerId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Player with id " + req.params.playerId
            });
          }
        } else res.send(data);
      }
    );
  };

// Delete a Player with the specified playerId in the request
exports.delete = (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(422).json({errors: validationErrors.array()});
        return;
    }
    Player.remove(req.params.playerId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Player with id ${req.params.playerId}.`
          });
        } else {wrong
          res.status(500).send({
            message: "Could not delete Player with id " + req.params.playerId
          });
        }
      } else res.send({ message: `Player was deleted successfully!` });
    });
  };

// Delete all Players from the database.
exports.deleteAll = (req, res) => {
    Player.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all players."
        });
      else res.send({ message: `All players were deleted successfully!` });
    });
  };


  exports.validate = (method) => {
    switch(method) {
      case 'create':
          return [
              body('first_name', 'first_name not set').exists().trim().escape(),
              body('last_name', 'last_name not set').exists().trim().escape(),
              body('phone', 'phone not set').exists().trim().escape(),
              body('address1', 'address1 not set').exists().trim().escape(),
              body('city', 'city not set').exists().trim().escape(),
              body('state', 'state not set').exists().trim().escape(),
              body('zip', 'zip not set correctly').exists().custom(customValidators.verifyZip).trim().escape(),
              body('email', 'Email not set correctly').exists().isEmail().custom(async (value) => customValidators.uniqueEmail(value, Player) ).trim().escape(),
              body('phone', 'phone not set correctly').exists().custom(customValidators.verifyPhonePattern).trim().escape(),
              body('password', 'password not set').exists().trim().escape(),
              body('user_name', 'user_name not set').exists().trim().escape(),
              body('team_id', 'team_id not set').exists().custom(customValidators.isAnInteger).trim().escape(),
              body('license_level_id', 'license_level_id not set').exists().custom(customValidators.isAnInteger).trim().escape()
          ];
          case 'update':
              return [
                  param("playerId", "player ID muse be a number").exists().custom(customValidators.isAnInteger),
                  body('first_name', 'first_name not set').exists().trim().escape(),
                  body('last_name', 'last_name not set').exists().trim().escape(),
                  body('phone', 'phone not set').exists().trim().escape(),
                  //body('address1', 'address1 not set').exists().trim().escape(),
                  body('city', 'city not set').exists().trim().escape(),
                  body('state', 'state not set').exists().trim().escape(),
                  body('zip', 'zip not set correctly').exists().custom(customValidators.verifyZip).trim().escape(),
                  body('email', 'Email not set correctly').exists().isEmail().trim().escape(),
                  body('phone', 'phone not set correctly').exists().custom(customValidators.verifyPhonePattern).trim().escape(),
                  body('password', 'password not set').exists().trim().escape(),
                  body('user_name', 'user_name not set').exists().trim().escape(),
                  body('team_id', 'team_id not set').exists().custom(customValidators.isAnInteger).trim().escape(),
                  body('license_level_id', 'license_level_id not set').exists().custom(customValidators.isAnInteger).trim().escape()
              ];
          case 'delete':
              return [param("playerId", "player ID muse be a number").exists().custom(customValidators.isAnInteger)];
          case 'findOne':
              return [param("playerId", "player ID muse be a number").exists().custom(customValidators.isAnInteger)];
      default:
          return [];
    }
}