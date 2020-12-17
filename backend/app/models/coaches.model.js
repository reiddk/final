const sql = require("./db.js");

// constructor
const Coach = function(coach) {
  this.first_name = coach.first_name || "";
  this.last_name = coach.last_name || "";
  this.address1 = coach.address1 || "";
  this.address2 = coach.address2 || "";
  this.notes = coach.notes || "";
  this.city = coach.city || "";
  this.state = coach.state || "";
  this.zip = coach.zip || "";
  this.team_id = coach.team_id;
  this.email = coach.email || "";
  this.phone = coach.phone || "";
  this.password = coach.password || "";
  this.user_name = coach.user_name || "";
  this.license_level_id = coach.license_level_id;
  this.person_type = "coach";
};

Coach.create = (newCoach, result) => {
  sql.query("INSERT INTO people SET ?", newCoach, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created coach: ", { id: res.insertId, ...newCoach });
    result(null, { id: res.insertId, ...newCoach });
  });
};

Coach.findById = (coachId, result) => {
    if (isNaN(coachId)) {
        result("Pass number in", null);
        return;
    }
  sql.query(`SELECT * FROM people WHERE id = ${coachId} and person_type='coach'`, (err, res) => {
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


Coach.findByEmail = (email, result) => {

  sql.query(`SELECT * FROM people WHERE email = ? and person_type='coach'`,[email], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found coach: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found customer with the id
    result({ kind: "not_found" }, null);
  });
};

Coach.getAll = result => {
  sql.query("SELECT * FROM people WHERE person_type = 'coach'", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("customers: ", res);
    result(null, res);
  });
};

Coach.updateById = (id, coach, result) => {
  sql.query(
    `UPDATE people
    SET first_name=?, last_name=?, address1=?, address2=?, notes=?, city=?, state=?, 
    zip=?, team_id=?, email=?, phone=?, password=?, user_name=?, license_level_id=?
    WHERE id=?;
    `,
    [coach.first_name, coach.last_name, coach.address, coach.address2, coach.notes, coach.city
        , coach.state, coach.zip, coach.team_id, coach.email, coach.phone, coach.password, coach.user_name,
        coach.license_level_id, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found coach with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated coach: ", { id: id, ...coach });
      result(null, { id: id, ...coach });
    }
  );
};

Coach.remove = (id, result) => {
  sql.query("DELETE FROM people WHERE id = ? AND person_type = 'coach'", id, (err, res) => {
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

Coach.removeAll = result => {
  sql.query("DELETE FROM people WHERE person_type = 'coach'", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} coaches`);
    result(null, res);
  });
};

module.exports = Coach;