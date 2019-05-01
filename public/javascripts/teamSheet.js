$(document).ready(function(){
  $("#addMorePlayers").click(function(){
    $("ol").append("<div class='player-number'><li></li></div> <div class='player-name'><div class='ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset'><input type='text' name='username' class='name-input middle no-focus-outline'></input></div></div>");
  });

  $("#submitTeamsheet").click(function(){
    var players = "";

    $('#teamsheetForm :input').each(function () {
      if ($(this).val() != "") {
        if (players == "") {
          players += $(this).val();
        } else {
          players += "," + $(this).val();
        }
      }
    });

    var teamName;

    $('#teamnameForm :input').each(function () {
      teamName = $(this).val();
    });

    var playerArray = players.split(",");

    $.post("createTeamSheet", { 'playerArray[]': JSON.stringify(playerArray), teamName: teamName }, function() {
      window.location = "/manager";
    });
  });
});
