var isCoach = false;
var coachEmail = "";
var coachPassword = "";
var teamId = "";

function addPlayerAccount(email, fullNamePassword) {

  //do the stuff with Firebase locally and not with the server? perhaps not
  firebase.auth().createUserWithEmailAndPassword(email, fullNamePassword).then(function() {
  	sendEmailVerification(email, fullNamePassword);
  }, function(error) {
  });
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
		if (user != null && user.displayName.startsWith("c") || isCoach) {


			isCoach = true;
			//password
			let isDoneAuthenticating = false;
			coachPassword = prompt("Managing players requires futher authentication. Please enter plassword Below");
			coachEmail =  user.email;
			teamId = user.photoUrl;

			console.log(coachEmail);
			console.log(coachPassword);

			printStuffOut();


			if(!isDoneAuthenticating) {
				firebase.auth().signInWithEmailAndPassword(coachEmail, coachPassword).then(function() {
					isDoneAuthenticating = true;
				}, function(error) {

					console.log(error);

				});
			}



			//is a coach
			$("#addPlayerForm").submit(function(e){
				e.preventDefault();
				var teamId = 'team1';
				var firstname = $("#addPlayerFirst").val();
				var lastname = $("#addPlayerLast").val();
				var position = $("#addPlayerPosition").val();
				var email = $("#addPlayerEmail").val();
				addPlayerAccount(email, firstname + lastname);
				var parameters = {
					teamId:teamId,
					playerName:firstname+lastname,
					playerEmail:email,
					playerPositionId:position
				}
				$.post('/createPlayer', parameters, function(playerId){
					console.log(error);
				});
					// add player to html page 
					new_player = "<tr>" +  
					"<td>" + position + "</td>" +
					"<td>" + firstname + " " + lastname + "</td>" +
					"<td>" + email + "</td>" +
					"<td><button type='button' id='delete' class='col-md-12' align='center'><span class='glyphicon glyphicon-trash text-center'></span></button></td>" + 
					"</tr>"; 
					$('table').append(new_player);
				});
		}
		else {
			signOut();
		}
	});
});


 /**
     * Sends an email verification to the user.
     */
     function sendEmailVerification(email, password) {
      // [START sendemailverification]
      var user = firebase.auth().currentUser;
      user.sendEmailVerification().then(function() {
      	alert("Email verification sent");
      }, function(error) {


      });
  }



  function printStuffOut(){
  	console("after authentication");

  	console.log(firebase.auth().currentUser);
  	console.log(teamId);
  	console.log(coachPassword);
  	console.log(coachEmail);


  	prompt("hi bitchessszzzzz");
  }