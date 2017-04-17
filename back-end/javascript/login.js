function createAccount() {

	//extract the values from the submit forms
	// Get the value from a dropdown select directly
	let name = $("#name").val();
	let email = $( "#email" ).val();
	let confirmEmail = $("#confirmEmail").val();
	let pass = $( "#password" ).val();
	let confirmPass = $("#confirmPassword").val();
	let teamName = $("#teamName");
	if (pass ===confirmPass && email ===confirmEmail) {

	//do the stuff with Firebase locally and not with the server? perhaps not
	firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(error) {


		var errorCode = error.code;
		var errorMessage = error.message;

			console.log(errorCode);
			console.log(errorMessage);
			if(errorCode === undefined) {
				sendEmailVerification();
			}
			else {
				alert(errorMessage);
			}

		});
	}
	else {
		alert("email or password doesn't match");
	}
}


 /**
     * Sends an email verification to the user.
     */
     function sendEmailVerification() {
      // [START sendemailverification]
      firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
    });
      // [END sendemailverification]
  }