$(document).ready(function() {

	firebase.auth().onAuthStateChanged(function(user) {
		if (user && user.emailVerified) {
			window.location = "/home";					
		} else {
			document.querySelector('#reset').addEventListener('keypress', function (e) {
				console.log("Hi");
    		var key = e.which || e.keyCode;
    		if (key === 13) {
    				passwordReset(e);
    			}
			});
			$('#olvidado').click(function(e) {
				e.preventDefault();
				$('div#form-olvidado').toggle('500');
			});
			$('#acceso').click(function(e) {
				e.preventDefault();
				$('div#form-olvidado').toggle('500');
			});
			$('#loginSubmitBtn').on('click', function(e){
				e.preventDefault();
				login();
			});
			$('#btn-olvidado').on('click', function(e){
				e.preventDefault();
				passwordReset();
			});
		}



	});



function passwordReset(e) {
	if (e!==undefined) {
		e.preventDefault();
	}
	let email = $("#reset").val();
	console.log(email);
	let  auth = firebase.auth();

	auth.sendPasswordResetEmail(email).then(function() {
  	alert("email sent!");
  	window.location = "/";
	}, function(error) {
		console.log(error);
  		alert(error);
	});
}
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
		$("#login-form").submit(function(e){
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

});

// graph
google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {

	var data = new google.visualization.DataTable();
	data.addColumn('number', 'Game');
	data.addColumn('number', 'Overall Score');

	data.addRows([
		[1, 66],   [2, 70],  [3, 86],  [4, 88],  [5, 96]
		]);

	var options = {
		pointSize: 8, 
		resize: true,
		backgroundColor: {fill: 'transparent'},
		chartArea: {backgroundColor: '#a6a6a6'}, 
		series: {
			0: { lineWidth: 4,
				color: '#538cc6' },
			}, 
			hAxis: {
				baselineColor: 'white',
				gridlines: {count: 0},
				titleTextStyle: { color: 'white' }, 
				textStyle: {
					color: 'white'
				}, 
				ticks: [1, 2, 3, 4, 5]
			},
			vAxis: {
				baselineColor: 'white',
				textStyle: {color: 'white'}, 
				titleTextStyle: { color: 'white' } 
			}, 
			legend: {
				position: 'none'
			},
			titleTextStyle: { 
				color: 'white',
				fontSize: 20,
				bold: false,
				italic: false }
			};

			var chart = new google.visualization.AreaChart(document.getElementById('graph'));

			chart.draw(data, options);
		}

		$(window).resize(function(){
			drawBasic();
		});

		function login() {
			console.log("logging in...");
			let email = $("#login_email").val().trim();
			let password = $("#login_password").val();
			firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
				if (firebase.auth().currentUser.emailVerified) {
					window.location = "/home";
				}
				else {
					alert("Email has not been verified");
					firebase.auth().signOut().then(function() {
  // Sign-out successful.
}).catch(function(error) {
	alert(error.message);
});
}
}, function(error) {
	var errorCode = error.code;
	var errorMessage = error.message;
	alert(errorMessage);
  // ...
});

		}
		function createAccount() {

	//extract the values from the submit forms
	// Get the value from a dropdown select directly
	let name = $("#firstName").val().trim() + " " + $("#lastName").val().trim();
	let email = $( "#email" ).val().trim();
	let confirmEmail = $("#confirmEmail").val().trim();
	let pass = $( "#password" ).val();
	let confirmPass = $("#confirmPassword").val();
	let teamName = $("#teamName").val().trim();
	// const schoolName = $("#schoolName").val().trim();

	if (pass ===confirmPass && email ===confirmEmail && teamName.length !==0 && $("#schoolName").val().trim().length !==0) {

	//do the stuff with Firebase locally and not with the server? perhaps not
	firebase.auth().createUserWithEmailAndPassword(email, pass).then(function() {
		sendEmailVerification(email, teamName, name, $("#schoolName").val().trim());

	}, function(error) {

		var errorCode = error.code;
		var errorMessage = error.message;


		alert(errorMessage);

	});
}
else {
	alert("email or password doesn't match or a field is blank");
}
}

function postRequestCreate(email, teamName, coachName, schoolName) {
	let parameters = {email: email, teamName: teamName, coachName:coachName, schoolName: $("#schoolName").val().trim()};

	$.post('/createTeam', parameters, function (coachIdTeamId){

		console.log(coachIdTeamId);
		newCoachId = coachIdTeamId[0];
		teamId = coachIdTeamId[1];

		if (newCoachId != undefined && teamId !=undefined) {
			console.log(newCoachId);
			console.log(teamId);
			let user = firebase.auth().currentUser;

			user.updateProfile({
				displayName: "*c*" + newCoachId,
				photoUrl: teamId

			});


			// user.displayName = "*c*" + newCoachId;
			// user.photoUrl = teamId;


			console.log(user);

			alert("Team has been created. Login to access");
			firebase.auth().signOut().then(function() {
				window.location = "/";
  		// Sign-out successful.
  	}).catch(function(error) {
  		alert(error.message);
  	});
  }
  else {
  	alert("error, please sign up again");
  	let user = firebase.auth().currentUser;

  	user.delete().then(function() {
  		console.log("error2");
  		alert("email verifcation failed. Please sent email again");
  	}, function(error) {
  		console.log("error3");
  		alert("Unfortunately there has been an internal error. Please sign up with a different email or call customer service 1800-VUE-GAME");
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
      var user = firebase.auth().currentUser;
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
  }