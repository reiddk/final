const Team = require("../models/teams.model.js");
const { body, param } = require('express-validator/check');
const { validationResult } = require('express-validator/check');
const customValidators = require('./custom-validators.js');
const dataManip = require('../services/data-manipulation.js');

// Create and Save a new Team
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
  
    // Create a team
    const team = new Team({
        name: req.body.name,
        coach_id: req.body.coach_id,
        league_id: req.body.league_id,
        notes: req.body.notes
    });
  
    // Save team in the database
    Team.create(team, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the team."
        });
      else res.send(data);
    });
  };

// Retrieve all Teams from the database.
exports.findAll = (req, res) => {
    Team.getAll((err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving teams."
        });
      } else {
        if (req.query.is_lookup) {
          res.send(data.map(d => { return {label: d.name, value: d.id }}));
        } else {
          res.send(dataManip.runDataManipulation(data, req.query));
        }
      }
    });
  };

// Find a single Teams with a teamId
exports.findOne = (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(422).json({errors: validationErrors.array()});
        return;
    }
    Team.findById(req.params.teamId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Team with id ${req.params.teamId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Team with id " + req.params.teamId
          });
        }
      } else res.send(data);
    });
  };

// Update a Team identified by the teamId in the request
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
  
    Team.updateById(
      req.params.teamId,
      new Team(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Team with id ${req.params.teamId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Team with id " + req.params.teamId
            });
          }
        } else res.send(data);
      }
    );
  };

// Delete a Team with the specified teamId in the request
exports.delete = (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(422).json({errors: validationErrors.array()});
        return;
    }
    Team.remove(req.params.teamId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Team with id ${req.params.teamId}.`
          });
        } else {wrong
          res.status(500).send({
            message: "Could not delete Team with id " + req.params.teamId
          });
        }
      } else res.send({ message: `Team was deleted successfully!` });
    });
  };

// Delete all Teams from the database.
exports.deleteAll = (req, res) => {
    Team.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all teams."
        });
      else res.send({ message: `All teams were deleted successfully!` });
    });
  };


  exports.validate = (method) => {
    switch(method) {
      case 'create':
          return [
              body('name', 'name not set').exists().trim().escape(),
              body('coach_id', 'coach_id not set').exists().custom(customValidators.isAnInteger).trim().escape(),
              body('league_id', 'league_id not set').exists().custom(customValidators.isAnInteger).trim().escape(),
          ];
          case 'update':
              return [
                  param("teamId", "team ID muse be a number").exists().custom(customValidators.isAnInteger),
                  body('name', 'name not set').exists().trim().escape(),
                  body('coach_id', 'coach_id not set').exists().custom(customValidators.isAnInteger).trim().escape(),
                  body('league_id', 'league_id not set').exists().custom(customValidators.isAnInteger).trim().escape(),
              ];
          case 'delete':
              return [param("teamId", "team ID muse be a number").exists().custom(customValidators.isAnInteger)];
          case 'findOne':
              return [param("teamId", "team ID muse be a number").exists().custom(customValidators.isAnInteger)];
      default:
          return [];
    }
}