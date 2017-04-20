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
	let email = $("#login_email").val().trim();
	let password = $("#login_password").val();
	firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
  if (firebase.auth().currentUser.emailVerified) {
  	alert("signed in");
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

	if (pass ===confirmPass && email ===confirmEmail) {

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
	alert("email or password doesn't match");
}
}

function postRequestCreate(email, teamName, coachName, schoolName) {
	let parameters = {email: email, teamName: teamName, coachName:coachName, schoolName: $("#schoolName").val().trim()
	};

$.post('/createTeam', parameters, function (errorOrTeamId){.

	console.log(errorOrTeamId);

	if (errorOrTeamId != true) {
		alert("team created");
		let user = firebase.auth().currentUser;
		user.displayName = errorOrTeamId;
		firebase.auth().signOut().then(function() {
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