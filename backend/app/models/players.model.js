const sql = require("./db.js");

// constructor
const Player = function(player) {
    this.first_name = player.first_name || "";
    this.last_name = player.last_name || "";
    this.address1 = player.address1 || "";
    this.address2 = player.address2 || "";
    this.notes = player.notes || "";
    this.city = player.city || "";
    this.state = player.state || "";
    this.zip = player.zip || "";
    this.team_id = player.team_id;
    this.email = player.email || "";
    this.phone = player.phone || "";
    this.password = player.password || "";
    this.user_name = player.user_name || "";
    this.license_level_id = player.license_level_id;
    this.person_type = "player";
};

Player.create = (newPlayer, result) => {
  sql.query("INSERT INTO people SET ?", newPlayer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created player: ", { id: res.insertId, ...newPlayer });
    result(null, { id: res.insertId, ...newPlayer });
  });
};



Player.findByEmail = (email, result) => {

    sql.query(`SELECT * FROM people WHERE email = ? and person_type='player'`,[email], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found player: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found customer with the id
      result({ kind: "not_found" }, null);
    });
  };

Player.findById = (playerId, result) => {
    if (isNaN(playerId)) {
        result("Pass number in", null);
        return;
    }
  sql.query(`SELECT * FROM people WHERE id = ${playerId} and person_type = 'player'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found customer with the id
    result({ kind: "not_found" }, null);
  });
};

Player.getAll = result => {
  sql.query("SELECT * FROM people WHERE person_type = 'player'", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("customers: ", res);
    result(null, res);
  });
};

Player.updateById = (id, player, result) => {
  sql.query(
    `UPDATE people
    SET first_name=?, last_name=?, address1=?, address2=?, notes=?, city=?, state=?, 
    zip=?, team_id=?, email=?, phone=?, password=?, user_name=?, license_level_id=?, person_type=?
    WHERE id=?;
    `,
    [player.first_name, player.last_name, player.address1, player.address2, player.notes, player.city
        , player.state, player.zip, player.team_id, player.email, player.phone, player.password, player.user_name,
        player.license_level_id, player.person_type, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found player with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated player: ", { id: id, ...player });
      result(null, { id: id, ...player });
    }
  );
};

Player.remove = (id, result) => {
  sql.query("DELETE FROM people WHERE id = ? AND person_type = 'player'", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Customer with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted customer with id: ", id);
    result(null, res);
  });
};

Player.removeAll = result => {
  sql.query("DELETE FROM people WHERE person_type = 'player'", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} players`);
    result(null, res);
  });
};

module.exports = Player;