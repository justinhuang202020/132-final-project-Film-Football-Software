$(document).ready(function() {
	$('#olvidado').click(function(e) {
		e.preventDefault();
		$('div#form-olvidado').toggle('500');
	});
	$('#acceso').click(function(e) {
		e.preventDefault();
		$('div#form-olvidado').toggle('500');
	});
});

$(function() {
	$('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
});
function createAccount() {

	//extract the values from the submit forms
	// Get the value from a dropdown select directly
	let name = $("#firstName").val().trim() + $("#lastName").val().trim();
	let email = $( "#email" ).val().trim();
	let confirmEmail = $("#confirmEmail").val().trim();
	let pass = $( "#password" ).val().trim();
	let confirmPass = $("#confirmPassword").val().trim();
	let teamName = $("#teamName").val().trim();
	let school = $("#schoolName").val().trim();
	if (pass ===confirmPass && email ===confirmEmail) {

	//do the stuff with Firebase locally and not with the server? perhaps not
	firebase.auth().createUserWithEmailAndPassword(email, pass).then(function() {
		sendEmailVerification(email, teamName, name);

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

function postRequestCreate(email, teamName, coachName, school) {
	const parameters = {email: email, teamName: teamName, coachName:coachName, school: school 
	};
	$.get('/createTeam', parameters, function (data){
		console.log(data);
		if (data ===true) {
			alert("Team has been created. Login to access");
			window.location = "/login";
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
      // [START sendemailverification]
      var user = firebase.auth().currentUser
      user.sendEmailVerification().then(function() {
      	postRequestCreate(email, teamName, name, school);
      	alert("Email verification sent");
      	success = true;
  // Email sent.
}, function(error) {

	user.delete().then(function() {
		alert("Email verifcation failed. Refresh page and restart creation of team.");
	}, function(error) {
		alert("Unfortunately there has been an internal error. Please sign up with a different email or call customer service 1800-VUE-GAME");
	});
});
      // [END sendemailverification]
  }
// submit button link to user homepage 
// $(function() {
//     $('#login-form-link').click(function(e) {
// 		$("#login-form").delay(100).fadeIn(100);
//  		$("#register-form").fadeOut(100);
// 		$('#register-form-link').removeClass('active');
// 		$(this).addClass('active');
// 		e.preventDefault();
// 	});
// }); 