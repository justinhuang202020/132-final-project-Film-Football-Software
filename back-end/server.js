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

	createTeam(email,teamName, coachName);

	console.log(email);
	console.log(teamName);
	console.log(coachName);

});

function getTeam(teamName){
	//var db = admin.database();
	console.log(db);/* 
	var ref = db.ref("teams");
	ref.orderByChild("name").on("child_added", function(snapshot) {
	  console.log(snapshot.key + " is " + snapshot.val().name + "!");
	});
	console.log(ref); */
}

//create a new team
function createTeam(email, teamName, coachName) {

}