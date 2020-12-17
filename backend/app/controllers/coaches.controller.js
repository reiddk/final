const Coach = require("../models/coaches.model.js");
const { body, param } = require('express-validator/check');
const { validationResult } = require('express-validator/check');

const customValidators = require('./custom-validators.js');

const dataManip = require('../services/data-manipulation.js');


// Create and Save a new Coach
exports.create = (req, res) => {
  console.log("req.body",req.body);
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

    //Needs to actually be a coach
    if (!req.body.person_type || req.body.person_type !== "coach") {
        res.status(400).send({
          message: "person_type needs to be coach"
        });
    }
  
    // Create a coach
    const coach = new Coach({
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
        person_type: "coach"
    });
  
    // Save coach in the database
    Coach.create(coach, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the coach."
        });
      else res.send(data);
    });
  };

// Retrieve all Coaches from the database.
exports.findAll = (req, res) => {
    Coach.getAll((err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving coaches."
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

// Find a single Coaches with a coachId
exports.findOne = (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(422).json({errors: validationErrors.array()});
        return;
    }
    Coach.findById(req.params.coachId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Coach with id ${req.params.coachId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Coach with id " + req.params.coachId
          });
        }
      } else res.send(data);
    });
  };

// Update a Coach identified by the coachId in the request
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
  
    Coach.updateById(
      req.params.coachId,
      new Coach(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Coach with id ${req.params.coachId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Coach with id " + req.params.coachId
            });
          }
        } else res.send(data);
      }
    );
  };

// Delete a Coach with the specified coachId in the request
exports.delete = (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(422).json({errors: validationErrors.array()});
        return;
    }
    Coach.remove(req.params.coachId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Coach with id ${req.params.coachId}.`
          });
        } else {wrong
          res.status(500).send({
            message: "Could not delete Coach with id " + req.params.coachId
          });
        }
      } else res.send({ message: `Coach was deleted successfully!` });
    });
  };

// Delete all Coaches from the database.
exports.deleteAll = (req, res) => {
    Coach.removeAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all coaches."
        });
      else res.send({ message: `All coaches were deleted successfully!` });
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
                body('email', 'Email not set correctly').exists().isEmail().custom(async (value) => customValidators.uniqueEmail(value, Coach) ).trim().escape(),
                body('phone', 'phone not set correctly').exists().custom(customValidators.verifyPhonePattern).trim().escape(),
                body('password', 'password not set').exists().trim().escape(),
                body('user_name', 'user_name not set').exists().trim().escape(),
                body('team_id', 'team_id not set').exists().custom(customValidators.isAnInteger).trim().escape(),
                body('license_level_id', 'license_level_id not set').exists().custom(customValidators.isAnInteger).trim().escape(),
                body('person_type', 'person type must be coach').equals('coach').trim().escape()
            ];
            case 'update':
                return [
                    param("coachId", "coach ID muse be a number").exists().custom(customValidators.isAnInteger),
                    body('first_name', 'first_name not set').exists().trim().escape(),
                    body('last_name', 'last_name not set').exists().trim().escape(),
                    body('phone', 'phone not set').exists().trim().escape(),
                    body('address1', 'address1 not set').exists().trim().escape(),
                    body('city', 'city not set').exists().trim().escape(),
                    body('state', 'state not set').exists().trim().escape(),
                    body('zip', 'zip not set correctly').exists().custom(customValidators.verifyZip).trim().escape(),
                    body('email', 'Email not set correctly').exists().isEmail().trim().escape(),
                    body('phone', 'phone not set correctly').exists().custom(customValidators.verifyPhonePattern).trim().escape(),
                    body('password', 'password not set').exists().trim().escape(),
                    body('user_name', 'user_name not set').exists().trim().escape(),
                    body('team_id', 'team_id not set').exists().custom(customValidators.isAnInteger).trim().escape(),
                    body('license_level_id', 'license_level_id not set').exists().custom(customValidators.isAnInteger).trim().escape(),
                    body('person_type', 'person type must be coach').equals('coach').trim().escape()
                ];
            case 'delete':
                return [param("coachId", "coach ID muse be a number").exists().custom(customValidators.isAnInteger)];
            case 'findOne':
                return [param("coachId", "coach ID muse be a number").exists().custom(customValidators.isAnInteger)];
        default:
            return [];
      }
  }