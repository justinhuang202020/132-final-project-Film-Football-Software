var express = require('express')
var app = express();
app.get('/createTeam', function(request, response) {
	response.render('createTeam.html');
});

app.post('/createTeam/submit', submitTeam);
function submitTeam(request, response) {
	const password = request.body.password;
	const name = request.body.name;
	const email = request.body.email;
	const team = request.body.team;
	setUpAccount(email, password, team, name); 


}
function setUpAccount(email, password, team, name) {
	let success = false;
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorMessage!==undefined) {
  	success = true;
  }
  // ...
});
	if (success) {
		var user = firebase.auth().currentUser;
		user.sendEmailVerification().then(function() {
			createTeam(email, passowrd, team, name)
  // Email sent.
}, function(error) {
  // An error happened.
});

	}
}
function createTeam(email, password, team, name) {

}