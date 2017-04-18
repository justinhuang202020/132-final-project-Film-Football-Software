var admin = require("firebase-admin");

var serviceAccount = require(__dirname + '/service_account_key.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://gamevue-c6394.firebaseio.com/"
});

var db = admin.database();

var express = require('express')
var app = express();

//body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//for HTML templating and rendering
var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/../front-end/views'); // tell Express where to find templates
app.set('view engine', 'html'); //register .html extension as template engine so we can render .html pages 

//for Javascript templating
app.use('/js', express.static(__dirname + '/../front-end/js'));
//for css templating
app.use('/styles', express.static(__dirname + '/../front-end/styles'));
//for img templating
app.use('/img', express.static(__dirname + '/../front-end/img'));


//listen to correct port
app.listen(8080, function(){
	console.log('- Server listening on port 8080');
});


//listening to the login test page
app.get('/', function(request, response){
	response.render('login_test.html');
});

//listening to the login page
app.get('/login', function(request, response){
	response.render('login.html');
});

//listening to the home page
app.get('/home', function(request, response){
	response.render('home.html');
});

//listening to the coach view page
app.get('/coachview', function(request, response){
	response.render('coach_view.html');
});

//listening to the player view page
app.get('/playerview', function(request, response){
	console.log(getTeam('falcons'));
	response.render('player_view.html');
});


app.post('/createTeam', function(request, response) {
	let email = request.body.email;
	let teamName = request.body.teamName;
	let coachName = request.body.coachName;
	let schoolName = request.body.schoolName;

	createTeam(email,teamName, coachName, schoolName);

	console.log(email);
	console.log(teamName);
	console.log(coachName);
	console.log(schoolName);


});

//create a new team
function createTeam(email, teamName, coachName, schoolName) {

	let teamData = {
		admin: email,
		schoolName: schoolName,
		teamName: teamName
	};

	let newTeamRef = db.ref().child('teams').push();

	newTeamRef.set(teamData, function(error) {
		if (error) {
			return new Boolean(true); 
		} else {
			return new Boolean(false);
		}
	});

}


function addPlayer(teamId, email, name, positionId) {

	//adding the player data to the database
	let playerData = {
		email: email,
		name: name,
		positionId: positionId
	};

	let newPlayerRef = db.ref().child('players').push();

	newPlayerRef.set(playerData, function(error) {
		if (error) {
			return new Boolean(true); 
		} else {
			return new Boolean(false);
		}
	});

}

function addCoach(teamId, email, name, posoitionId) {


}

function addGame(teamId) {

}

function addPlay(teamId, gameId){

}

