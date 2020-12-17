const Lookups = require("../models/leagues.model.js");

exports.league = (req, res) => {
    Lookups.getLeagues((err, data) => {
        if (err) {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving leagues."
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
