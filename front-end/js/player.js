var isCoach = false;
var coachEmail = "";
var coachPassword = "";
var isAuthenticating = false;
var signedOut = false;
var count = 0;
var positionToText = {
	1:'QB',
	2:'RB',
	3:'WR',
	4:'TE',
	5:'OL',
	6:'DL',
	7:'LB',
	8:'CB',
	9:'S'
}

function signOut() {
	firebase.auth().signOut().then(function() {
		window.location = "/";
	}).catch(function(error) {
		console.log(error.message);
		window.location = "/";

	});
}



$(document).ready(function(){
	$('#addPlayerBtn').on('click', function(){
		$('#myModal').modal('hide');
	});
	firebase.auth().onAuthStateChanged(function(user) {
		if (user != null && user.displayName != null &&  user.displayName.startsWith("c") && !isAuthenticating) {
			$('#passwordModal').modal({
			  backdrop: 'static',
			  keyboard: false
			});
			$('#passwordModal').modal('show');
			$('#submitPassword').on('click', function(){
				coachEmail = user.email;
				coachPassword = $('#passwordInput').val();
				$('#passwordInput').val('');
				attemptSignIn(function(signedIn){
					if(signedIn){
						$('#passwordModal').modal('hide');
					}
				});
			});
			var option = '<option></option>';
			for(key in positionToText){
				var position = positionToText[key];
				option += '<option value="'+ position + '">' + position + '</option>';
			}
			$("#addPlayerPosition").append(option);
			isAuthenticating = true;
			var coachParams = {
				coachId:user.displayName.substring(1)
			};
			$.post('/getCoach', coachParams, function(response){
				var teamId = response.teamId;
				localStorage.teamId = teamId;
				var playerParams = {
					teamId:localStorage.teamId
				}
				$.post('/getPlayersForTeam', playerParams, function(response){
					for(id in response){
						var player = response[id];
						var new_player = "<tr>" +  
						"<td>" + positionToText[player.positionId] + "</td>" +
						"<td>" + player.name + "</td>" +
						"<td>" + player.email + "</td>" +
						"</tr>"; 
						$('table').append(new_player);
					}
				});
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
		else if(!isAuthenticating) {
			signOut();
		}
	});
	function attemptSignIn(callback){
		firebase.auth().signInWithEmailAndPassword(coachEmail, coachPassword).then(function() {
			callback(true);
		}, function(error) {
			callback(false);
		});
	}
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
			var position = $("#addPlayerPosition")[0].selectedIndex;
			var email = $("#addPlayerEmail").val();

			firebase.auth().createUserWithEmailAndPassword(email, firstname+lastname).then(function() {


				var parameters = {
					teamId:localStorage.teamId,
					playerName:firstname+' '+lastname,
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
								var new_player = "<tr>" +  
								"<td>" + positionToText[position] + "</td>" +
								"<td>" + firstname + " " + lastname + "</td>" +
								"<td>" + email + "</td>" +
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