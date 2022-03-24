module.exports = function (app) {
  var teamList = require("../controller/teamController");

  app.route("/teams/:user_id")
  .get(teamList.getAllTeams);

  app.route("/team/:user_id/:team_id")
    .get(teamList.getTeamById)
    .delete(teamList.deleteTeam);
  
  app.route("/team")
  .post(teamList.postTeam);



   ///*** route for update****////  
  app.route("/team/updateTeamName/:user_id/:team_id")
    .put(teamList.updateTeamName);

  app.route("/team/insertUserInTeam/:user_id/:team_id")
    .post(teamList.insertUserInTeam);

  app.route("/team/deleteUserInTeam/:user_id/:team_id")
    .delete(teamList.deleteUserInTeam);
  ///************************//// 
};
