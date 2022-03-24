var sql = require("./db");

var UserTeamRlt = function (team) {
  (this.user_id = team.userId),
    (this.name = team.name),
    (this.username = team.username),
    (this.email = team.email),
    (this.team_id = team.teamId),
    (this.team_name = team.teamName);
};

var Usergroup = function (u) {
  this.user_id = u.userId;
};

var UserList = function (u) {
  (this.team_name = u.teamName), 
  (this.UserGroup = [{ Usergroup }]);
};


let columns = [
  "usercalendar.user_id",
  "usercalendar.name",
  "usercalendar.username",
  "usercalendar.email",
  "team.team_id",
  "team.team_name",
];

UserTeamRlt.getAllTeams = function (userId, result) {
  let sqlQuery =
    "SELECT ?? FROM usercalendar INNER JOIN userteam ON usercalendar.user_id = userteam.user_id INNER JOIN team ON userteam.team_id = team.team_id WHERE userteam.user_id = ?";
  sql.query(sqlQuery, [columns, userId], function (err, res) {
    if (err) {
      result(err);
    }
    result(null, res);
  });
};

UserTeamRlt.getTeamById = function (userId, teamId, result) {
  let sqlQuery =
    "SELECT ?? FROM usercalendar INNER JOIN userteam ON usercalendar.user_id = userteam.user_id INNER JOIN team ON userteam.team_id = team.team_id WHERE userteam.user_id = ? AND team.team_id = ?";
  sql.query(sqlQuery, [columns, userId, teamId], function (err, res) {
    if (err) {
      result(err);
    }
    console.log(sqlQuery);

    result(null, res);
  });
};

UserList.postTeam = function (newTeam, result) {
  const userElement = newTeam.UserGroup;
  const teamName = newTeam.team_name;

  let sqlTeam = "INSERT INTO team (team_name) VALUES (?)";
  let sqlUserTeam = "INSERT INTO userteam (user_id, team_id) VALUES (?, ?)";

  // CHECK DUPLICATE TEAM NAME
  // -------------------------
  // CHECK DUPLICATE TEAM NAME

  sql.query(sqlTeam, [teamName], function (err, res) {
    if (err) {
      result(err);
    }

    // LOOP ADD USERTEAM
    userElement.forEach((e) => {
      // CHECK DUPLICATE USER ID ---------- //

      sql.query(sqlUserTeam, [e.user_id, res.insertId], function (error, rlt) {
        if (error) {
          result(error);
        }
        console.log("res: ", rlt);
      });

    });

    result(null, newTeam);

  });
};


//********** vvvvvvvv JANE vvvvvvvvvv ****************/

UserList.update_TeamName = function (teamId, userList , result) {
  //const userElement = userList.UserGroup;
  const teamName = userList.team_name;
  // update in team table change team_name
  sql.query(
    "UPDATE team SET team_name = ? WHERE team_id = ?",
    [teamName, teamId],

    ///??????////
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);

      } else {
        result(null, res);
      }
    }
  );
};

UserList.add_UserInTeamByUserID = function (userList,teamId,   result) {
  const userElement = userList;
  //const teamName = userList.team_name;
  userElement.forEach((e) => {
    sql.query(  
      "INSERT INTO userteam(user_id, team_id) Select ?, ? WHERE NOT EXISTS (SELECT * FROM userteam (user_id,activity_id) IN (?))",
      [e.user_id, teamId,e.user_id, teamId], 

      
      function (err, res) {
        if (err) {
          console.log("error: ", err);
          result(null, err);
        } else {
          result(null, res);
        }
      }
    );

  });  
};


UserList.remove_UserInTeamByUserID = function (teamId, userList , result) {
  const userElement = userList.UserGroup;
  //const teamName = userList.team_name;
  userElement.forEach((e) => {
    sql.query(  
      "DELETE FROM userteam WHERE team_id = ? AND user_id = ?",
      [teamId ,e.user_id], 
      function (err, res) {
        if (err) {
          console.log("error: ", err);
          result(null, err);
        } else {
          result(null, res);
        }
      }
    );

  });
};

UserList.remove_Team = function (teamId, result) {
  sql.query(
    "DELETE FROM team WHERE team_id = ?",
    [teamId],
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};
/************ ^^^^^^^^ JANE ^^^^^^^^^ ************/

module.exports = {
  UserTeamRlt,
  UserList,
};
