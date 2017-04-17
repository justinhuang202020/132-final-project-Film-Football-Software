  var admin = require("firebase-admin");
  
  admin.initializeApp({
  	credential: admin.credential.cert({
  		projectId: "gamevue-c6394",
  		clientEmail: "foo@<PROJECT_ID>.iam.gserviceaccount.com",
  		privateKey: "-----BEGIN PRIVATE KEY-----\n<KEY>\n-----END PRIVATE KEY-----\n"
  	}),
  	databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
  });


  var express = require('express')
  var app = express();

//body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//for HTML templating and rendering
var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/helperHTML'); // tell Express where to find templates, in this case the '/helperHTML' directory
app.set('view engine', 'html'); //register .html extension as template engine so we can render .html pages 

//for Javascript templating
app.use('/javascript', express.static(__dirname + "/javascript"));


//listen to correct port
app.listen(8080, function(){
	console.log('- Server listening on port 8080');
});


//listening to the login page
app.get('/', function(request, response){
	response.render('login.html');
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

//create a new team
function createTeam(email, teamName, coachName) {

}