function createAccount() {

	//extract the values from the submit forms
	// Get the value from a dropdown select directly
	let email = $( "#email" ).val();
	let pass = $( "#password" ).val();

	//do the stuff with Firebase locally and not with the server? perhaps not
	firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(error) {


		var errorCode = error.code;
		var errorMessage = error.message;


		if(errorCode === undefined) {
			sendEmailVerification();
		}

	});
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