var isCoach = false;
var coachEmail = "";
var coachPassword = "";
var isAuthenticating = false;
var isSignedIn = true;
var signedOut = false;
var count = 0;


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
			isAuthenticating = true;
			var coachParams = {
				coachId:user.displayName.substring(1)
			};
			$.post('getCoach', coachParams, function(response){
				var teamId = response.teamId;
				localStorage.teamId = teamId;
			});
		}			
		// add player to html page 
		// new_player = "<tr>
		// 			<td>" + position + "</td>
		// 			<td>" + firstname + " " + lastname + "</td>
		// 			<td>" + email + "</td>
		// 			<td><button type='button' id='delete' class='col-md-12' align='center'><span class='glyphicon glyphicon-trash text-center'></span></button></td>
		// 		</tr>"; 
		// $('table').append(new_player);
		if (isAuthenticating){
			if(isSignedIn && !signedOut){
				coachEmail =  coachEmail || user.email;
				firebase.auth().signOut().then(function() {
					isSignedIn = false;
					signedOut = true;
					loopPrompt();
				}).catch(function(error) {
					console.log(error.message);
				});
			}
		}
		else if(!isAuthenticating) {
			signOut();
		}
	});
	function loopPrompt(){
		if(!isSignedIn){
			coachPassword = prompt("Managing players requires futher authentication. Please enter password below.");
			firebase.auth().signInWithEmailAndPassword(coachEmail, coachPassword).then(function() {
				isSignedIn = true;
			}, function(error) {
				console.log(error.message);
				loopPrompt();
				//signOut();
			});
		}
	}
});







function addPlayerFromForm() {
	firebase.auth().signOut().then(function() {
			


			//is a coach
			var firstname = $("#addPlayerFirst").val();
			var lastname = $("#addPlayerLast").val();
			var position = $("#addPlayerPosition").val();
			var email = $("#addPlayerEmail").val();

			firebase.auth().createUserWithEmailAndPassword(email, firstname+lastname).then(function() {


				var parameters = {
					teamId:localStorage.teamId,
					playerName:firstname+lastname,
					playerEmail:email,
					playerPositionId:position
				}
				$.post('/createPlayer', parameters, function(playerId){
					//add this to the current player firebase user
					if(playerId != undefined) {

						firebase.auth().currentUser.updateProfile({
							displayName: "p" + playerId
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