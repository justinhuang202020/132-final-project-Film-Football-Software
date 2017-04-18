let success = false;
function createAccount() {

	//extract the values from the submit forms
	// Get the value from a dropdown select directly
	let name = $("#name").val();
	let email = $( "#email" ).val();
	let confirmEmail = $("#confirmEmail").val();
	let pass = $( "#password" ).val();
	let confirmPass = $("#confirmPassword").val();
	let teamName = $("#teamName").val();
	if (pass ===confirmPass && email ===confirmEmail) {

	//do the stuff with Firebase locally and not with the server? perhaps not
	firebase.auth().createUserWithEmailAndPassword(email, pass).then(function() {
		sendEmailVerification(email, teamName, name);
				
	}, function(error) {

		var errorCode = error.code;
		var errorMessage = error.message;
		console.log("Hi");
			
		alert(errorMessage);

		});
	}
	else {
		alert("email or password doesn't match");
	}
}

function postRequestCreate(email, teamName, coachName) {
	console.log(email);
	console.log(teamName);
	console.log(coachName);
	console.log("Hi");
	 const parameters = {email: email, teamName: teamName, coachName:coachName 
      };
       $.get('/createTeam', parameters, function (data){
       		
       		if (data ===true) {
       			alert("team created");
       		}
       		else {
       			alert("error, please sign up again");
       			var user = firebase.auth().currentUser;
       			user.delete().then(function() {
 				alert("email verifcation failed. Please sent email again");
				}, function(error) {
  						alert("Unfortunately there has been an internal error. Please sign up with a different email or call customer service 1800-GAME-VUE");
					});
       		}
       });
}
 /**
     * Sends an email verification to the user.
     */
     function sendEmailVerification(email, teamName, name) {
     	console.log("enter");
      // [START sendemailverification]
      var user = firebase.auth().currentUser
       user.sendEmailVerification().then(function() {
       	postRequestCreate(email, teamName, name);
      	alert("Email verification sent");
      	success = true;
  // Email sent.
}, function(error) {

user.delete().then(function() {
  alert("email verifcation failed. Please sent email again");
}, function(error) {
  alert("Unfortunately there has been an internal error. Please sign up with a different email or call customer service 1800-GAME-VUE");
});
});
      // [END sendemailverification]
  }