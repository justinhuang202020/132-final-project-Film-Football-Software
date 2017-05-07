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
function signOut() {
  firebase.auth().signOut().then(function() {
    window.location = "/";
  }).catch(function(error) {
    alert(error.message);
  });
}
$(document).ready(function(){
	firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
	console.log("player.js opened");
	$("#addPlayerForm").submit(function(e){
		e.preventDefault();
		console.log("HERE"); 
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
		// add player to html page 
		// new_player = "<tr>
		// 			<td>" + position + "</td>
		// 			<td>" + firstname + " " + lastname + "</td>
		// 			<td>" + email + "</td>
		// 			<td><button type='button' id='delete' class='col-md-12' align='center'><span class='glyphicon glyphicon-trash text-center'></span></button></td>
		// 		</tr>"; 
		// $('table').append(new_player);
	});
	}
	else {
		window.location = "/"
	}
});
});