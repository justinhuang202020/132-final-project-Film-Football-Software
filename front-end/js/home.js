function addPlayerAccount(name, email,position, number, confirmEmail, pass, confirmPass) {
  // const schoolName = $("#schoolName").val().trim();

  if (pass ===confirmPass && email ===confirmEmail) {

  //do the stuff with Firebase locally and not with the server? perhaps not
  firebase.auth().createUserWithEmailAndPassword(email, pass).then(function() {
    sendEmailVerification(email, name, position, number);

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
function sendEmailVerification(email, name, position, number) {
  console.log("enter");
      // [START sendemailverification]
      var user = firebase.auth().currentUser;
      user.sendEmailVerification().then(function() {
        postRequestCreate(email, name, position, number);
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
    function postRequestCreate(email, name, position, number) {
  // let parameters = {email: email, teamName: teamName, coachName:coachName, schoolName: $("#schoolName").val().trim()};

// $.post('/createPlayer', parameters, function (errorOrTeamId){

//   console.log(errorOrTeamId);

  // if (errorOrTeamId != true) {
  //   alert("team created");
  //   let user = firebase.auth().currentUser;
  //   user.displayName = errorOrTeamId;
  firebase.auth().signOut().then(function() {
  //     // Sign-out successful.
}).catch(function(error) {
  alert(error.message);
});
  // }
  // else {
  //   alert("error, please sign up again");
  //   let user = firebase.auth().currentUser;

  //   user.delete().then(function() {
  //     console.log("error2");
  //     alert("email verifcation failed. Please sent email again");
  //   }, function(error) {
  //     console.log("error3");
  //     alert("Unfortunately there has been an internal error. Please sign up with a different email or call customer service 1800-VUE-GAME");
  //   });
  // }
// });
}
var positionToTrait = {};
var positionToGrades = {};
var gameIdToGrades = {};
var gameIdToGames = {};
var timestamps = [];
var recentGamesDict = {};
var grades = [];
var timestampToGameIds = {};
var userIsCoach;
var teamId;
$(document).ajaxStop(function(){
	var recentGames;
	$('#select-position-home').change(function(e){
		populatePage(userIsCoach);
	});
	function populatePage(){
		$('.strength-container').empty();
		$('.weakness-container').empty();
		var sw;
		recentGames = [];
		var positionId = $('#select-position-home')[0].selectedIndex + 1;
		if(userIsCoach){
			for(gameId in recentGamesDict){
				var gameGrades = [];
				if(positionToGrades[positionId]){
					for(var i = 0;i<positionToGrades[positionId][0].length;i++){
						if(positionToGrades[positionId][1][i] == gameId){
							gameGrades.push(positionToGrades[positionId][0][i]);
						}
					}
				}
				if(gameGrades.length > 0){
					var opponent = recentGamesDict[gameId].opponent;
					var gameScore = calcGameScore(gameGrades,!userIsCoach);
					recentGames.push({opponent:opponent,gameScore:gameScore});
				}
			}
			if(positionToGrades[positionId]){
				sw = getStrengthsAndWeaknesses(positionToGrades[positionId][0]);
			}
			else{
				sw = {strengths:[],weaknesses:[]};
			}
		}
		else{
			timestamps.sort();
			for(var i=0;i<5;i++){
				if(gameIdToGames[timestampToGameIds[timestamps[i]]]){
					var opponent = gameIdToGames[timestampToGameIds[timestamps[i]]].opponent;
					var currGrades = gameIdToGrades[timestampToGameIds[timestamps[i]]];
					var gameScore = calcGameScore(currGrades,!userIsCoach);
					recentGames.push({opponent:opponent,gameScore:gameScore});
				}
				else{
					recentGames.push({opponent:"Eastlake", gameScore:80});
				} 
			}
			sw = getStrengthsAndWeaknesses(grades);
		}
		strengths = sw.strengths;
		weaknesses = sw.weaknesses;
		for(var i=0;i<strengths.length;i++){
			buildStrengthWeaknessEl(strengths[i].trait,strengths[i].ratio, true);
		}
		for(var i =0; i <weaknesses.length;i++){
			buildStrengthWeaknessEl(weaknesses[i].trait, weaknesses[i].ratio, false);
		}
		//draw chart
		drawBasic();
	}
	function buildStrengthWeaknessEl(text, score, isStrength){
		var strengthOrWeakness = (isStrength)?'strength':'weakness';
		var divString = '<div></div>';
		var spanString = '<span></span>';
		var outerDiv = $(divString);
		outerDiv.addClass('col-xs-4 text-center');
		var scoreDiv = $(divString);
		var playScoreClassString = "";
		if(score < .40){
			playScoreClassString = strengthOrWeakness+"-score play-score-bad";
		}
		else if(score < 70){
			playScoreClassString = strengthOrWeakness+"-score play-score-avg";
		}
		else{
			playScoreClassString = strengthOrWeakness+"-score play-score-good";
		}
		scoreDiv.addClass(playScoreClassString);
		addScoreCss(scoreDiv, score);
		var spanDiv = $(spanString);
		spanDiv.html(text);
		outerDiv.append(scoreDiv);
		outerDiv.append(spanDiv);
		$('.'+strengthOrWeakness+'-container').append(outerDiv);	
	}
	function calcGameScore(allGrades, isObj){
		var maxScore  = 0;
		var totalScore = 0;
		if(isObj){
			for(gradeObj in allGrades){
				var currGrades = allGrades[gradeObj].grades;
				for(grade in currGrades){
					var importance = parseInt(positionToTrait[3][grade].importance);
					maxScore += parseInt(5*importance);
					totalScore+= parseInt(currGrades[grade]*importance);
				}
			}
		}
		else{
			for(var i=0;i<allGrades.length;i++){
				var currGrades = allGrades[i];
				for(grade in currGrades){
					console.log(positionToTrait);
					var importance = parseInt(positionToTrait[3][grade].importance);
					maxScore += parseInt(5*importance);
					totalScore+= parseInt(currGrades[grade]*importance);
				}
			}
		}
		return parseInt(Math.floor(totalScore/maxScore*100));
	}
	function addScoreCss(el, score){
		var height = 100;
		var frac = score;
		var elHeight = frac*height;
		var marginHeight = height-(frac*height);
		el.css({
			'margin-top': marginHeight,
			'height': elHeight
		});
	}
	function getStrengthsAndWeaknesses(swGrades){
		var maxTotalForTraits = {};
		var totalForTraits = {};
		for(var i = 0; i< swGrades.length; i++){
			var grade = swGrades[i];
			for(category in grade){
				if(!maxTotalForTraits[category]){
					maxTotalForTraits[category] = 0;
					totalForTraits[category] = 0;
				}
				maxTotalForTraits[category] += parseInt(5);
				totalForTraits[category] += parseInt(grade[category]);
			}
		}
		var strengths = [];
		var strengthsMax = 0;
		var strengthMaxEl;
		var strengthsMin = Infinity;
		var strengthMinEl;
		var weaknesses = [];
		var weaknessesMax = 0;
		var weaknessMaxEl;
		var weaknessesMin = Infinity;
		var weaknessMinEl;
		for(trait in maxTotalForTraits){
			var ratio = totalForTraits[trait]/maxTotalForTraits[trait];
			if(strengths.length < 3){
				var toPush = {
					trait:trait,
					ratio:ratio
				};
				if(ratio<strengthsMin){
					strengthsMin =ratio;
					strengthMinEl = toPush;
				}
				if(ratio > strengthsMax){
					strengthsMax = ratio;
					strengthMaxEl = toPush;
				}
				strengths.push(toPush);
			}
			else{
				if(ratio > strengthsMin){
					strengths.splice(strengths.indexOf(strengthMinEl),1);
					var toPush = {
						trait:trait,
						ratio:ratio
					};
					var smallerElement = toPush;
					var otherElement = strengths[Math.abs(strengths.indexOf(strengthMaxEl) - 1 )];
					if(ratio > strengthsMax){
						smallerElement = strengthMaxEl;
						strengthsMax = ratio;
						strengthMaxEl = toPush;
					}
					if(smallerElement.ratio < otherElement.ratio){
						strenghtsMin = smallerElement.ratio;
						strenghtMinEl = smallerElement;
					}
					strengths.push(toPush);
				}
			}
			if(weaknesses.length < 3){
				var toPush = {
					trait:trait,
					ratio:ratio
				};
				if(ratio<weaknessesMin){
					weaknessesMin =ratio;
					weaknessMinEl = toPush;
				}
				if(ratio > weaknessesMax){
					weaknessesMax = ratio;
					weaknessMaxEl = toPush;
				}
				weaknesses.push(toPush);
			}
			else{
				if(ratio < weaknessesMax){
					weaknesses.splice(strengths.indexOf(weaknessMaxEl),1);
					var toPush = {
						trait:trait,
						ratio:ratio
					};
					var largerElement = toPush;
					var otherElement = strengths[Math.abs(strengths.indexOf(weaknessMaxEl) - 1 )];
					if(ratio < weaknessesMin){
						largerElement = weaknessMinEl;
						weaknessesMin= ratio;
						weaknessMinEl = toPush;
					}
					if(largerElement.ratio > otherElement.ratio){
						weaknessesMax = largerElement.ratio;
						weaknessMaxEl = largerElement;
					}
					weaknesses.push(toPush);
				}
			}
		}
		return {strengths:strengths,weaknesses:weaknesses};
	}
	$("#select-position").change(function(e) {
		console.log(teamId);
		 $("#traits").empty()
		 var categoryParams = {
			  teamId:teamId,
			  positionId: $('#select-position')[0].selectedIndex
		  };
      $.post('/getCategoriesForPosition', function(response){
		   for(var trait in response){
			var traitImportanceFullValue = (response[trait].importance - 1)*25;
			console.log(traitImportanceFullValue);
			var li = $("<li></li>");
			var input = $("<input step='25'></input>");
			input.attr("type", "range");
			input.attr("step", 25);
			input.attr("value", traitImportanceFullValue);
			li.html(trait);
			li.append(input);
			$("#traits").append(li);
		  }
		});
    });
	$(window).resize(function(){
        drawBasic();
    });
	//chart
	google.charts.load('current', {packages: ['corechart', 'line'], 'callback':populatePage});
	function drawBasic() {

	  var data = new google.visualization.DataTable();
	  data.addColumn('string', 'Opponent');
	  data.addColumn('number', 'Game Score');
	  for(var i= 0; i< recentGames.length;i++){
		data.addRow([recentGames[i].opponent, recentGames[i].gameScore]);
	  } 

	  var options = {
		title: 'Last '+recentGames.length+' Games',
		pointSize: 8, 
		resize: true,
		areaOpacity: .5, 
		backgroundColor: '#2C3A42',
		chartArea: {backgroundColor: '#a6a6a6'}, 
		series: {
		  0: { lineWidth: 4,
			color: '#538cc6' },
		  }, 
			// backgroundColor: '#f2f2f2', 
			hAxis: {
			  title: 'Opponent',
			  baselineColor: 'white',
			  gridlines: {count: 0},
			  titleTextStyle: { color: 'white' }, 
			  textStyle: {
				color: 'white'
				// fontName: 'Myriad'
			  }, 
			},
			vAxis: {
			  title: 'Overall Score',
			  baselineColor: 'white',
			  textStyle: {color: 'white'}, 
			  titleTextStyle: { color: 'white' } 
			}, 
			legend: {
			  textStyle: {
				color: 'white'
					// fontName: 'Myriad'
				  }
				},
				titleTextStyle: { 
				  color: 'white',
			  // fontName:'Myriad',
			  fontSize: 20,
			  bold: false,
			  italic: false }
			};

			var chart = new google.visualization.AreaChart(document.getElementById('chart'));

			chart.draw(data, options);
	}
});
$(document).ready(function(){
	
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
     $.post('/getPositions', function(response){
      var numbers = [1, 2, 3, 4, 5];
      var option = '';
      for(id in response){
       var position = response[id];
       if(position != "head" && position !=null){
        option += '<option value="'+ position + '">' + position + '</option>';
      }
    }
    $('#select-position').append(option);
	$('#select-position-home').append(option);
  }); 
	userIsCoach = (firebase.auth().currentUser.displayName[0] == 'c');

      function loadSkillgraph() {
       $(".skillData").each(function(index, element) {
      // element == this
      var mydata = $(element).data();
      var cnt = 0;

      //recursive call with a time delay so user can see graph draw.
      function go() {
        if (cnt++ < mydata['percent']) {
          setTimeout(go, 10);
        }
        $(element).css('width', cnt + '%');

      }

      go();

    });
     }
     loadSkillgraph();
     $("#openTraitInputBtn").on('click', function(){
      $('#newTraitLi').removeClass('hidden'); 
    });

  //For Justin
  $('#addTraitBtn').on('click', function(){
    var traitText = $("#newTraitTxt").val();
    var traitImportance = ($('#newTraitImportance').val()/25) + 1;
    var option = $("#select-position")[0].selectedIndex;
    var traitImportanceFullValue = $('#newTraitImportance').val();
    var li = $("<li></li>");
    var input = $("<input step='25'></input>");
    input.attr("type", "range");
    input.attr("step", 25);
    input.attr("value", traitImportanceFullValue);
    li.html(traitText);
    li.append(input);
    $("#traits").append(li);
    const parameters = {
      teamId: 'team1',
      positionId: 4, 
      importance: traitImportance,
      title: traitText
    }
    $.post('/createCategory', parameters, function (error){
      if(error){
        console.log(error);
      }
    });
    $('#newTraitLi').addClass('hidden');
    $("#newTraitTxt").val("");
    $('#newTraitImportance').val(50);
  });
  if(userIsCoach){
	  var coachParams = {
		 coachId: firebase.auth().currentUser.displayName.substring(1) 
	  }
	  $.post('/getCoach', coachParams, function(response){
		  teamId = response.teamId;
		  var gradesParams = {
			teamId:response.teamId  
		  };
		  $.post('/getAllGradesForTeam', gradesParams, function(response){
			  for(game in response){
				if(!positionToGrades[response[game].positionId]){
					positionToGrades[response[game].positionId] = [];
					positionToGrades[response[game].positionId][0] = [];
					positionToGrades[response[game].positionId][1] = [];
				}
				positionToGrades[response[game].positionId][0].push(response[game].grades);
				positionToGrades[response[game].positionId][1].push(response[game].gameId);
			  }
		  });
		  $.post('/getCategoriesForPosition', function(response){
				for(trait in response){
					positionToTrait[3] = response;
				}
		  });
		  var recentParams = {
			  teamId:'team1',
			  numGames:5
		  };
		  $.post('/getRecentGames', recentParams, function(response){
			recentGamesDict = response;
		  });
	  });
  }
  else{
	  var getPlayerParams = {
		playerId: firebase.auth().currentUser.displayName.substring(1)
	  };
	  $.post('/getPlayer', getPlayerParams, function(response){
		  teamId = response.teamId;
		  var getGradesParams = {
			 playerId:firebase.auth().currentUser.displayName.substring(1)
		  }
		  $.post('/getAllGradesForPlayer', getGradesParams, function(response){
		   for(gradeId in response){
			   grades.push(response[gradeId].grades);
				var grade = response[gradeId];
				if(!gameIdToGrades[grade.gameId]){
					gameIdToGrades[grade.gameId] = [];
				}
				gameIdToGrades[grade.gameId].push(grade);
			}
			for(gameId in gameIdToGrades){
				var gameParams = {
					gameId:gameId
				};
				$.post('/getGame', gameParams, function(response){
					gameIdToGames[response.gameId] = response;
					timestamps.push(response.timestamp);
					timestampToGameIds[response.timestamp] = response.gameId;
				});
			}
		  });
		  var categoryParams = {
			  teamId:response.teamId,
			  positionId:response.positionId
		  };
		  var positionId = response.positionId;
		  $.post('/getCategoriesForPosition', categoryParams, function(response){
				for(trait in response){
					positionToTrait[positionId] = response;
				}
		  });
	  });
  }

  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
} else {
    // No user is signed in.

    window.location = "/";
  }
});
});

function signOut() {
  firebase.auth().signOut().then(function() {
    window.location = "/";
  }).catch(function(error) {
    alert(error.message);
    window.location = "/";

  });
}

