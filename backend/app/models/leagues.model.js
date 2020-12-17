const sql = require("./db.js");

exports.getLeagues = callback => {
  sql.query("SELECT id, name, description FROM leagues", (err, res) => {
    if (err) {
      console.log("error: ", err);
      callback(null, err);
      return;
    }

    console.log("leagues: ", res);
    callback(null, res);
  });
}