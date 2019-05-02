$(document).ready(function(){
  $("#createTeam").click(function(){

    var team1 = $( "#team1" ).val();

    var team2 = $( "#team2" ).val();

    $.post("/createMatch", { team1: team1, team2: team2 }).done(function(data){
      window.location.href = data;
    });
  });
});
