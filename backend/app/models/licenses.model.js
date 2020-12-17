const sql = require("./db.js");

exports.getLicenses = callback => {
  sql.query("SELECT * FROM license_levels", (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(null, err);
      return;
    }

    callback(null, res);
  });
}