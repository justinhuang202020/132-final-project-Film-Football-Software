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

//listening to the coach view page
app.get('/gamepage', function(request, response){
	response.render('game_page.html');
});

//listening to the player view page
app.get('/playerview', function(request, response){
	response.render('player_view.html');
});


app.post('/createCoach', function(request, respnonse) {

	let teamId = request.body.teamId;
	let coachName = request.body.coachName;
	let coachEmail = request.body.coachEmail;
	let coachPositionId = request.body.coachPositionId;

	let error = addCoach(teamId, coachEmail, coachName, coachPositionId);

	response.json(error);

});


app.post('/createPlayer', function(request, respnonse) {

	let teamId = request.body.teamId;
	let playerName = request.body.playerName;
	let playerEmail = request.body.playerEmail;
	let playerPositionId = request.body.playerPositionId;

	let error = addPlayer(teamId, coachEmail, coachName, coachPositionId);

	response.json(error);

});

app.post('/createPlay', function(request, response){
	let gameId = request.body.gameId;
	let videoUrl = request.body.videoUrl;
	
	let error = addPlay(gameId, videoUrl);
	
	response.json(error);
});

app.post('/createGame', function(request, response){
	let teamId = request.body.teamId;
	let opponent = request.body.opponent;
	let teamScore = request.body.teamScore;
	let opponentScore = request.body.opponentScore;
	
	let error = addGame(teamId, opponent, teamScore, opponentScore);
	
	response.json(error);
});

app.post('/createCategory', function(request, response){
	let teamId = request.body.teamId;
	let positionId = request.body.positionId;
	let importance = request.body.importance;
	let title = request.body.title;
	
	let error = addCategory(teamId, positionId, importance, title);
	
	response.json(error);
});


// app.post('/createField', function(request, response) {
// 	let position = request.body.position;
// 	let category = request.body.category;
// 	let importance = request.body.importance;
// 	addCategory(position, category, importance);
	
// });

app.post('/createTeam', function(request, response) {
	let email = request.body.email;
	let teamName = request.body.teamName;
	let coachName = request.body.coachName;
	let schoolName = request.body.schoolName;

	let errorOrTeamId = createTeam(email,teamName, coachName, schoolName);

	response.json(errorOrTeamId);

});
// function addCategory(position, category, importance) {
// 	let data = {
		
// 	}
// 	let newCategory = db.ref().child('teams').child('team1').child('categories').push();
// 	console.log(newCategory);
// }

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
			return newTeamRef.key;
		}
	});

}


function addPlayer(teamId, email, name, positionId) {
	//adding the player data to the database
	let playerData = {
		email: email,
		name: name,
		positionId: positionId,
		teamId:teamId
	};

	let newPlayerRef = db.ref().child('players').push();
	let playerId = newPlayerRef.key;
	
	newPlayerRef.set(playerData, function(error) {
		if (error) {
			return new Boolean(true); 
		} else {
			return new Boolean(false);
		}
	});
}

function addCoach(teamId, email, name, positionId) {
	let coachData = {
		email: email,
		name: name,
		position: positionId,
		teamId:teamId
	};

	let newCoachRef = db.ref().child("coaches").push();
	
	newCoachRef.set(coachData, function(error) {
		if (error) {
			return new Boolean(true); 
		} else {
			return new Boolean(false);
		}
	});


}

function addGame(teamId, opponent, teamScore, opponentScore) {
	let gameData = {
		opponent:opponent,
		teamId:teamId,
		teamScore:teamScore,
		opponentScore:opponentScore
	};
	
	let newGameRef = db.ref().child('games').push();
	
	newGameRef.set(gameData,function(error){
		if (error) {
			return new Boolean(true); 
		} else {
			return new Boolean(false);
		}
	});
}

function addPlay(gameId, videoUrl){
	console.log("adding play...");
	let playData = {
		gameId:gameId,
		videoUrl:videoUrl
	};
	
	let newPlayRef = db.ref().child('plays').push();
	
	newPlayRef.set(playData, function(error){
		if (error) {
			return new Boolean(true); 
		} else {
			return new Boolean(false);
		}
	});
}

function addGrades(playId, grades, playerId){
	let gradeData = {
		playId:playId,
		grades:grades,
		playerId:playerId
	}
	
	let newGradeRef = db.ref().child('grades').push();
	
	newGradeRef.set(gradeData, function(error){
		if (error) {
			return new Boolean(true); 
		} else {
			return new Boolean(false);
		}
	});
}

function addCategory(teamId, positionId, importance, title){
	let categoryData = {
		importance:importance,
		title:title
	};
	
	let newCategoryRef = db.ref().child('teams').child(teamId).child('categories').child(positionId).push();
	
	newCategoryRef.set(categoryData, function(error){
		if (error) {
			return new Boolean(true); 
		} else {
			return new Boolean(false);
		}
	});
}

