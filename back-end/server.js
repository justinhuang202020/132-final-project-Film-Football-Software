var admin = require("firebase-admin");

var serviceAccount = require(__dirname + '/service_account_key.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://gamevue-c6394.firebaseio.com/"
});

var db = admin.database();

var express = require('express');
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


//listening to the login page
app.get('/', function(request, response){
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

//listening to the coach view page
app.get('/gamepage', function(request, response){
	response.render('game_page.html');
});

//listening to the player view page
app.get('/playerview', function(request, response){
	response.render('player_view.html');
});

//listening to the players page
app.get('/players', function(request, response){
	response.render('player.html');
});


////////////////////////// RETRIEVAL FUNCTIONS BELOW //////////////////////////////////////////////////

app.post('/getPositions', function(request, response) {
	
	let positionsRef = db.ref().child('positions');

	positionsRef.once("value", function(snapshot) {
		response.json(snapshot.val());
	}, function(error) {
		response.json(undefined);
	});
});


app.post('/getGames', function(request, response) {
	let teamId = request.body.teamId;

	teamId = "team1";
	
	let gamesRef = db.ref().child('games');

	gamesRef.orderByChild("teamId").equalTo(teamId).once("value", function(snapshot) {
		response.json(snapshot.val());
	}, function(error) {
		response.json(undefined);
	});
});

app.post('/getCategoriesForPosition', function(request, response){
	let positionId = request.body.positionId;
	positionId = "4";
	
	let categoriesRef = db.ref().child('teams').child('team1').child('categories').child(positionId);

	categoriesRef.once("value", function(snapshot) {
		response.json(snapshot.val());
	}, function(error) {
		response.json(undefined);
	});
});


app.post('/getPlaysForGame', function(request, response) {
	let gameId = request.body.gameId;
	gameId = "game1";
	
	let playsRef = db.ref().child('plays');

	playsRef.orderByChild("gameId").equalTo(gameId).once("value", function(snapshot) {
		response.json(snapshot.val());
	}, function(error) {
		response.json(undefined);
	});
});



///////////////////////////RETRIEVAL FUNCTIONS ABOVE //////////////////////////////////////////////////





////////////////////////// CREATION FUNCTIONS BELOW //////////////////////////////////////////////////
app.post('/createCoach', function(request, response) {

	let teamId = request.body.teamId;
	let coachName = request.body.coachName;
	let coachEmail = request.body.coachEmail;
	let coachPositionId = request.body.coachPositionId;

	addCoach(teamId, coachEmail, coachName, coachPositionId, function(newCoachId) {
		response.json(newCoachId);
	});

});


app.post('/createPlayer', function(request, response) {

	let teamId = request.body.teamId;
	let playerName = request.body.playerName;
	let playerEmail = request.body.playerEmail;
	let playerPositionId = request.body.playerPositionId;

	addPlayer(teamId, playerName, playerEmail, playerPositionId, function(newPlayerId) {
		response.json(newPlayerId);
	});


});

app.post('/createPlay', function(request, response){
	let gameId = request.body.gameId;
	let videoUrl = request.body.videoUrl;
	
	addPlay(gameId, videoUrl, function(newPlayId) {
		response.json(newPlayId);
	});
	
});

app.post('/createGame', function(request, response){
	let teamId = request.body.teamId;
	let opponent = request.body.opponent;
	let teamScore = request.body.teamScore;
	let opponentScore = request.body.opponentScore;

	let gameData = {
		opponent:opponent,
		teamId:teamId,
		teamScore:teamScore,
		opponentScore:opponentScore
	};
	
	let newGameRef = db.ref().child('games').push();
	
	newGameRef.set(gameData).then(function() {
		response.json(newGameRef.key);
	}, function(error){
		response.json(undefined);
	});	

});

app.post('/createCategory', function(request, response){
	let teamId = request.body.teamId;
	let positionId = request.body.positionId;
	let importance = request.body.importance;
	
	addCategory(teamId, positionId, importance, title);
	
	response.json(new Boolean(true));
});


app.post('/createTeam', function(request, response) {
	let email = request.body.email;
	let teamName = request.body.teamName;
	let coachName = request.body.coachName;
	let schoolName = request.body.schoolName;

	createTeam(email,teamName, coachName, schoolName, function(newCoachId) {
		response.json(newCoachId);

	});

});

app.post("/addGrade", function(request, response) {

	let playId = request.body.play;
	let grades = request.body.grades;
	let playerId = request.body.playerId;
	let teamId = request.body.teamId;

	addGrades(playId, grades, playerId, teamId);

});


//create a new team
function createTeam(email, teamName, coachName, schoolName, callback) {

	let teamData = {
		admin: email,
		schoolName: schoolName,
		teamName: teamName
	};

	let newTeamRef = db.ref().child('teams').push();

	newTeamRef.set(teamData).then(function() {
		//create new coach for admin// callback with that coach's id
		let teamId = newTeamRef.key;
		addCoach(teamId, email, coachName, 10, function(newCoachId) {
			callback([newCoachId, teamId]);
		});

	}, function(error) {
		callback(undefined);
	});
}


function addPlayer(teamId, email, name, positionId, callback) {
	//adding the player data to the database
	let playerData = {
		email: email,
		name: name,
		positionId: positionId,
		teamId:teamId
	};

	let newPlayerRef = db.ref().child('players').push();
	let playerId = newPlayerRef.key;
	
	newPlayerRef.set(playerData).then(function() {
		callback(playerId);

	}, function(error) {
		callback(undefined);
	});


}

function addCoach(teamId, email, name, positionId, callback) {
	let coachData = {
		email: email,
		name: name,
		position: positionId,
		teamId:teamId
	};

	let newCoachRef = db.ref().child("coaches").push();
	
	newCoachRef.set(coachData).then(function() {
		callback(newCoachRef.key);

	}, function(error) {
		callback(undefined);
	});


}

function addPlay(gameId, videoUrl, callback){
	let playData = {
		gameId:gameId,
		videoUrl:videoUrl
	};
	
	let newPlayRef = db.ref().child('plays').push();
	
	newPlayRef.set(playData).then(function(){
		callback(newPlayRef.key);
	}, function(error){
		callback(undefined);
	});
}

//no need for callback of any sorts
function addGrades(playId, grades, playerId, teamId){
	let gradeData = {
		playId:playId,
		grades:grades,
		playerId:playerId,
		teamId: teamId
	};
	
	let newGradeRef = db.ref().child('grades').push();
	
	newGradeRef.set(gradeData, function(error){
		
	});
}

//addCategory
//no need for callback of any sorts
function addCategory(teamId, positionId, importance, title){
	let categoryData = {
		importance:importance
	};
	
	let newCategoryRef = db.ref().child('teams').child(teamId).child('categories').child(positionId).child(title);
	
	newCategoryRef.set(categoryData, function(error){
		if (error) {
			return new Boolean(true); 
		} else {
			return new Boolean(false);
		}
	});
}

////////////////////////// CREATION FUNCTIONS ABOVE //////////////////////////////////////////