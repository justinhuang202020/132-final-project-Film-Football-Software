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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

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

//listening to the plays page
app.get('/plays', function(request, response){
	response.render('plays.html');
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
	
	let gamesRef = db.ref().child('games');

	gamesRef.orderByChild("teamId").equalTo(teamId).once("value", function(snapshot) {
		response.json(snapshot.val());
	}, function(error) {
		response.json(undefined);
	});
});

app.post('/getGame', function(request, response) {
	let gameId = request.body.gameId;
	
	let gamesRef = db.ref().child('games').child(gameId);

	gamesRef.once("value", function(snapshot) {
		var game = snapshot.val();
		game.gameId = gameId;
		response.json(game);
	}, function(error) {
		response.json(undefined);
	});
});

app.post('/getRecentGames', function(request, response) {
	let teamId = request.body.teamId;
	let numGames = parseInt(request.body.numGames);
	
	let gamesRef = db.ref().child('games');

	gamesRef.orderByChild("teamId").limitToLast(numGames).equalTo(teamId).once("value", function(snapshot) {
		response.json(snapshot.val());
	}, function(error) {
		response.json(undefined);
	});
});

app.post('/getCategoriesForPosition', function(request, response){
	let positionId = request.body.positionId;
	let teamId = request.body.teamId;
	console.log("getting categories...");
	let categoriesRef = db.ref().child('teams').child(teamId).child('categories').child(positionId);

	categoriesRef.once("value", function(snapshot) {
		response.json(snapshot.val());
	}, function(error) {
		response.json(undefined);
	});
});

app.post('/getAllGradesForPlayer', function(request, response){
	let playerId = request.body.playerId;
	
	let gradesRef = db.ref().child('grades');
	
	gradesRef.orderByChild('playerId').equalTo(playerId).once('value', function(snapshot){
		let gradeObject = snapshot.val();
		response.json(gradeObject);
	},function(error){
		response.json(undefined);
	});
});

app.post('/getGameGradesForPlayer', function(request, response){
	let playerId = request.body.playerId;
	let gameId = request.body.gameId;
	let gamePlayer = gameId + playerId;
	
	let gradesRef = db.ref().child('grades');
	
	gradesRef.orderByChild('gamePlayer').equalTo(gamePlayer).once('value', function(snapshot){
		let gradeObject = snapshot.val();
		response.json(gradeObject);
	},function(error){
		response.json(undefined);
	});
});

app.post('/getAllGradesForTeam', function(request, response){
	let teamId = request.body.teamId;
	
	let gradesRef = db.ref().child('grades');
	
	gradesRef.orderByChild('teamId').equalTo(teamId).once('value', function(snapshot){
		let gradeObject = snapshot.val();
		response.json(gradeObject);
	},function(error){
		response.json(undefined);
	});
});


app.post('/getPlaysForGame', function(request, response) {
	let gameId = request.body.gameId;
	
	let playsRef = db.ref().child('plays');

	playsRef.orderByChild("gameId").equalTo(gameId).once("value", function(snapshot) {
		var plays = snapshot.val();
		for(id in plays){
			var play = plays[id];
			play.playId = id;
		}
		response.json(plays);
	}, function(error) {
		response.json(undefined);
	});
});

app.post('/getPlay', function(request, response){
	let playId = request.body.playId;
	
	let playsRef = db.ref().child('plays').child(playId);

	playsRef.once("value", function(snapshot) {
		var play = snapshot.val();
		play.playId = playId;
		response.json(play);
	}, function(error) {
		response.json(undefined);
	});
});

app.post('/getPlayer', function(request, response){
	let playerId = request.body.playerId;
	
	let playsRef = db.ref().child('players').child(playerId);

	playsRef.once("value", function(snapshot) {
		response.json(snapshot.val());
	}, function(error) {
		response.json(undefined);
	});
});

app.post('/getCoach', function(request, response){
	let coachId = request.body.coachId;
	
	let playsRef = db.ref().child('coaches').child(coachId);

	playsRef.once("value", function(snapshot) {
		response.json(snapshot.val());
	}, function(error) {
		response.json(undefined);
	});
});

app.post('/getPlayersForTeam', function(request, response){
	let teamId = request.body.teamId;
	
	let playersRef = db.ref().child('players');
	
	playersRef.orderByChild("teamId").equalTo(teamId).once("value", function(snapshot) {
		var players = snapshot.val();
		for(id in players){
			var player = players[id];
			player.playerId = id;
		}
		response.json(players);
	}, function(error) {
		response.json(undefined);
	});
});


///////////////////////////RETRIEVAL FUNCTIONS ABOVE //////////////////////////////////////////////////





////////////////////////// CREATION FUNCTIONS BELOW //////////////////////////////////////////////////
app.post('/updatePlayName', function(request, response){
	let playId = request.body.playId;
	let playTitle = request.body.playTitle;
	
	let playsRef = db.ref().child('plays').child(playId);
	
	playsRef.update({playTitle:playTitle});
	
	playsRef.once("value", function(snapshot) {
		response.json(snapshot.val());
	}, function(error) {
		response.json(undefined);
	});
});

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
	let fileName = request.body.fileName;
	
	addPlay(gameId, fileName, function(newPlayId) {
		response.json(newPlayId);
	});
});

app.post('/createGame', function(request, response){
	let teamId = request.body.teamId;
	let opponent = request.body.opponent;
	let teamScore = request.body.teamScore;
	let opponentScore = request.body.opponentScore;
	let timestamp = Date.now();

	let gameData = {
		opponent:opponent,
		teamId:teamId,
		teamScore:teamScore,
		opponentScore:opponentScore,
		numPlays:0,
		timestamp:timestamp
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
	let title = request.body.title;
	
	
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
	let gameId = request.body.gameId;
	let playId = request.body.playId;
	let grades = request.body.grades;
	let playerId = request.body.playerId;
	let positionId = request.body.positionId;
	let teamId = request.body.teamId;
	let gamePlayer = gameId + playerId;

	addGrades(gameId, playId, grades, playerId, positionId, teamId, gamePlayer);

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


function addPlayer(teamId, name, email, positionId, callback) {
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

function addPlay(gameId, fileName, callback){
	
	let gamesRef = db.ref().child('games').child(gameId);

	gamesRef.orderByChild("numPlays").once("value", function(snapshot) {
		let numPlays = snapshot.val().numPlays + 1;
		let playTitle = 'Play ' +numPlays;
		let playData = {
			gameId:gameId,
			playTitle:playTitle,
			fileName:fileName
		};
		
		let newPlayRef = db.ref().child('plays').push();
		
		newPlayRef.set(playData).then(function(){
			playData.playId = newPlayRef.key;
			callback(playData);
		}, function(error){
			callback(undefined);
		});
		gamesRef.update({
		  "numPlays": numPlays
		});
	}, function(error) {
		response.json(undefined);
	});
}

//no need for callback of any sorts
function addGrades(gameId, playId, grades, playerId, positionId, teamId, gamePlayer){
	let gradeData = {
		gameId:gameId,
		playId:playId,
		grades:grades,
		playerId:playerId,
		positionId:positionId,
		teamId: teamId,
		gamePlayer:gamePlayer
	};
	
	let newGradeRef = db.ref().child('grades').push();
	
	newGradeRef.set(gradeData, function(error){
		if (error) {
			return new Boolean(true); 
		} else {
			return new Boolean(false);
		}
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