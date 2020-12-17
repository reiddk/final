const Licenses = require("../models/licenses.model.js");

exports.getAll = (req, res) => {
    Licenses.getLicenses((err, data) => {
        if (err) {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving licenses."
            });
        } else {
            if (req.query.is_lookup) {
              res.send(data.map(d => { return {label: d.description, value: d.id }}));
            } else {
              res.send(dataManip.runDataManipulation(data, req.query));
            }
        }
    });
};
