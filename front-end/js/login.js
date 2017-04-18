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
    	e.preventDefault();
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
	});
	$("#register-form").submit(function(e){
    e.preventDefault();
  });
	$('#register-form-link').click(function(e) {
		console.log("click");
		e.preventDefault();
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
	});
});

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
function createAccount() {
	
	//extract the values from the submit forms
	// Get the value from a dropdown select directly
	let name = $("#firstName").val().trim() + " " + $("#lastName").val().trim();
	let email = $( "#email" ).val().trim();
	let confirmEmail = $("#confirmEmail").val().trim();
	let pass = $( "#password" ).val().trim();
	let confirmPass = $("#confirmPassword").val().trim();
	let teamName = $("#teamName").val().trim();
	let schoolName = $("#schoolName").val().trim();
	console.log(name);
	console.log(teamName);
	console.log(schoolName);
	if (pass ===confirmPass && email ===confirmEmail) {

	//do the stuff with Firebase locally and not with the server? perhaps not
	firebase.auth().createUserWithEmailAndPassword(email, pass).then(function() {
		sendEmailVerification(email, teamName, name, schoolName);
				
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

function postRequestCreate(email, teamName, coachName, schoolName) {
	console.log(email);
	console.log(teamName);
	console.log(coachName);
	console.log("Hi");
	 const parameters = {email: email, teamName: teamName, coachName:coachName, schoolName: schoolName
      };
       $.get('/createTeam', parameters, function (error){
       		console.log("Hi1");
       		if (error ===false) {
       			alert("team created");
       			console.log("false");
       		}
       		else {
       			alert("error, please sign up again");
       			var user = firebase.auth().currentUser;
       			console.log("error1");
       			user.delete().then(function() {
       				console.log("error2");
 				alert("email verifcation failed. Please sent email again");
				}, function(error) {
					console.log("error3");
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
       	postRequestCreate(email, teamName, name, schoolName);
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