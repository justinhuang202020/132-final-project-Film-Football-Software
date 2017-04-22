function addPlayerAccount(name, email,position, number, confirmEmail, pass, confirmPass) {
  // const schoolName = $("#schoolName").val().trim();

  if (pass ===confirmPass && email ===confirmEmail) {

  //do the stuff with Firebase locally and not with the server? perhaps not
  firebase.auth().createUserWithEmailAndPassword(email, pass).then(function() {
    sendEmailVerification(email, name, position, number);

  }, function(error) {

    var errorCode = error.code;
    var errorMessage = error.message;
  

    alert(errorMessage);

  });
}
  else {
    alert("email or password doesn't match");
  }
}
$(document).ready(function(){
	console.log("player.js opened");
	$("#addPlayerForm").submit(function(e){
		e.preventDefault();
		var teamId = 'team1';
		var firstname = $("#addPlayerFirst").val();
		var lastname = $("#addPlayerLast").val();
		var position = $("#addPlayerPosition").val();
		var email = $("#addPlayerEmail").val();
		addPlayerAccount(firstname+lastname, email, position, 1, email, firstname+lastname, firstname+lastname);
		var parameters = {
			teamId:teamId,
			playerName:firstname+lastname,
			playerEmail:email,
			playerPositionId:position
		}
		$.post('/createPlayer', parameters, function(error){
			console.log(error);
		});
	});
});