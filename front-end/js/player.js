var isCoach = false;
var coachEmail = "";
var coachPassword = "";
var teamId = "";
var isAuthenticating = false;



function signOut() {
	firebase.auth().signOut().then(function() {
		window.location = "/";
	}).catch(function(error) {
		console.log(error.message);
		window.location = "/";

	});
}



$(document).ready(function(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user != null && user.displayName != null &&  user.displayName.startsWith("c") && !isAuthenticating) {
			console.log(user);
			isAuthenticating = true;

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
			coachPassword = prompt("Managing players requires futher authentication. Please enter plassword Below");
			coachEmail =  user.email;
			teamId = user.photoURL;


			firebase.auth().signOut().then(function() {
				// Sign-out successful.
				firebase.auth().signInWithEmailAndPassword(coachEmail, coachPassword).then(function() {

				}, function(error) {

					console.log(error.message);
					signOut();
				});


			}).catch(function(error) {
				console.log(error.message);
				signOut();
			});

		}
		else if(!isAuthenticating) {
			signOut();
		}
	});
			}
		}
});
});







function addPlayerFromForm() {


	firebase.auth().signOut().then(function() {



			//is a coach
			var firstname = $("#addPlayerFirst").val();
			var lastname = $("#addPlayerLast").val();
			var position = $("#addPlayerPosition").val();
			var email = $("#addPlayerEmail").val();

			console.log("creating player");

			firebase.auth().createUserWithEmailAndPassword(email, firstname+lastname).then(function() {
				console.log("created player account");


				var parameters = {
					teamId:teamId,
					playerName:firstname+lastname,
					playerEmail:email,
					playerPositionId:position
				}
				$.post('/createPlayer', parameters, function(playerId){


										//add this to the current player firebase user
										if(playerId != undefined) {

											console.log("created the player Id in DB")
											firebase.auth().currentUser.updateProfile({
												displayName: "p" + playerId,
												photoURL: teamId

											}).then(function() {
													// add player to html page 
													new_player = "<tr>" +  
													"<td>" + position + "</td>" +
													"<td>" + firstname + " " + lastname + "</td>" +
													"<td>" + email + "</td>" +
													"<td><button type='button' id='delete' class='col-md-12' align='center'><span class='glyphicon glyphicon-trash text-center'></span></button></td>" + 
													"</tr>"; 
													$('table').append(new_player);

													sendEmailVerification();
												}, function(error) {
													prompt(error);
													//signOut();
												});
										} else {
											signOut();
										}




									});


}, function(error) {
	prompt(error);
				//signOut();
			});

});


}


 /**
     * Sends an email verification to the user.
     */
     function sendEmailVerification() {
     	var user = firebase.auth().currentUser;
     	user.sendEmailVerification().then(function() {
     		alert("Email verification sent");

     		// Sign-out successful.
     		firebase.auth().signInWithEmailAndPassword(coachEmail, coachPassword).then(function() {
     			console.log("coach signed back in");
     		}, function(error) {

     			console.log(error.message);
     			signOut();
     		});

     	}, function(error) {


     	});
     }



     function printStuffOut(){

     	console.log(firebase.auth().currentUser);
     	console.log(teamId);
     	console.log(coachPassword);
     	console.log(coachEmail);
     }