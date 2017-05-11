function signOut() {
	firebase.auth().signOut().then(function() {
		window.location = "/";
	}).catch(function(error) {
		alert(error.message);
		window.location = "/";

	});
}
$(document).ajaxStop(function(){
	
});
$(document).ready(function(){	
	firebase.auth().onAuthStateChanged(function(user) {
	var userIsCoach = (firebase.auth().currentUser.displayName[0] == 'c');
	if (user) {
	var getGameParams = {
		gameId:localStorage.gameId
	};
	$.post('/getGame', getGameParams, function(response){
		$('.opponent-name span').html('vs. '+response.opponent);
	});
	var $video  = $('video'),
		$vidContainer = $('.vid-player-sctn:first'),
		$leftSctn = $('.play-view-left-sctn'),
		$rightSctn = $('.play-view-right-sctn'),
		$window = $(window); 
	var positionToPlayerDict = {};
	var textToImportanceDict = {};
	var playIdToPlay = {};
	var playIdToGrades = {};
	var traits = {};
	var teamId;
	var postParams = {
		teamId:localStorage.teamId
	};
	if($('#select-position')){
		$.post('/getPositions', function(response){
		  var option = '';
		  for(id in response){
		   var position = response[id];
		   if(position != "head" && position !=null){
			option += '<option value="'+ position + '">' + position + '</option>';
		  }
		}
		$('#select-position').append(option);
	  }); 
	} 
	if(userIsCoach){
		var coachParams = {
		 coachId: firebase.auth().currentUser.displayName.substring(1) 
		}
	  $.post('/getCoach', coachParams, function(response){
		  teamId = response.teamId
	  });
		var playsParams = {
			gameId:localStorage.gameId
		}
		$.post('/getPlaysForGame', playsParams, function(response){
			var playArray = [];
			for(play in response){
				response[play].playId = play;
				playIdToPlay[play] = response[play];
				playArray.push(response[play]);
			}
			for(var i = 0; i<playArray.length;i++){
				var play = playArray[i];
				var active = false;
				if(localStorage.playId ===''){
					if(i==0){
						active = true;
						setVideoSrc(play);
					}
				}
				else{
					if(play.playId ===localStorage.playId){
						active = true;
						setVideoSrc(playIdToPlay[localStorage.playId]);
					}
				}
				addCoachPlayEl(play.playId, play.playTitle, active);
			}
		});
	}
	else{
		if($('#addPlayBtn')){
			$('#addPlayBtn').hide();
		}
		$(".player-nav").addClass("hidden");
		var getPlayerParams = {
			playerId: firebase.auth().currentUser.displayName.substring(1)
		  };
	  $.post('/getPlayer', getPlayerParams, function(response){
		  teamId = response.teamId;
		 var categoryParams = {
		  teamId:response.teamId,
		  positionId: response.positionId
		};
		$.post('/getCategoriesForPosition', categoryParams,  function(response){
			traits = response;
			var gradesParams = {
				gameId:localStorage.gameId,
				playerId:firebase.auth().currentUser.displayName.substring(1)
			}
			$.post('/getGameGradesForPlayer', gradesParams, function(gradesObj){
				if(!gradesObj){
					$('.no-grades-error').removeClass("hidden");
				}
				for(gradeId in gradesObj){
					var grade = gradesObj[gradeId];
					playIdToGrades[grade.playId] = grade.grades;
				}
				var count = 0;
				for(playId in playIdToGrades){
					var initPlayId;
					if(count == 0){
						initPlayId = playId;
						count++;
					}
					var playId
					var playParams = {
						playId:playId
					}
					$.post('/getPlay', playParams, function(playsObj){
						if(playsObj.playId == initPlayId){
							setVideoSrc(playsObj);
							populateScoreSection(playIdToGrades[playsObj.playId]);
						}
						playIdToPlay[playsObj.playId] = playsObj;
						var playScore = calcPlayScore(playIdToGrades[playsObj.playId]);
						addPlayEl(playsObj.playId, playScore, playsObj.playTitle, (playsObj.playId == initPlayId));
					});
				}
			});
		}); 
	  });
	}
	function calcPlayScore(grades){
		var maxPotentialScore = 0;
		var totalScore = 0;
		for(trait in grades){
			var traitImportance = parseInt(traits[trait].importance);
			maxPotentialScore += 5*traitImportance;
			totalScore += traitImportance*parseInt(grades[trait]);
		}
		return Math.floor((totalScore/maxPotentialScore)*100);
	}
	$.post('/getPlayersForTeam', postParams, function(response){
		for(id in response){
			var player = response[id];
			player.playerId = id;
			if(positionToPlayerDict[player.positionId]){
				positionToPlayerDict[player.positionId].push(player);
			}
			else{
				positionToPlayerDict[player.positionId] = [player];
			}
		}
	});

	$(window).resize(function(){
		//set video player dimensions
		var containerWidth = $vidContainer.parent().width();
		var newWidth = containerWidth - 70;//subtract 100 bc width of carat section and container padding
		var newHeight = newWidth*9/16;//16:9 aspect ratio
		$video.css('width', newWidth);
		$video.css('height',newHeight);
		//set height of right section to be equal to left
		var leftSctnHeight = $leftSctn.height();
		$rightSctn.css('height',leftSctnHeight);
	}).resize();
	$(".score-buttons .btn-custom").on('click', function(e){
		var buttonText = $(e.target).text();
		var $activeTrait = $('.position-trait-active');
		$activeTrait.find('.position-trait-score').text(buttonText);
		$activeTrait.removeClass('position-trait-active');
		if($activeTrait.parent().next().length > 0){
			var $nextTrait = $activeTrait.parent().next().find('.position-trait');
			$nextTrait.addClass('position-trait-active');
		}
		else{
			$('.submit-player-grade-btn').removeClass('hidden');
		}
	});
	$(document).on('click', '.position-trait' , function(e) {
		var $activeTrait = $('.position-trait-active');
		$activeTrait.removeClass("position-trait-active");
		$(this).addClass("position-trait-active");
	});
	$(document).on('click', '.play' , function(e) {
		$('.active').removeClass('active');
		$(this).addClass('active');
		setVideoSrc(playIdToPlay[$(this)[0].id]);
		if(!userIsCoach){
			populateScoreSection(playIdToGrades[$(this)[0].id]);
		}
	});
	$('.glyphicon-triangle-left').on('click', function(){
		var index = $('.play.active').index();
		if(index!=0){
			var newPlay = $('.play').eq(index-1);
			$('.play.active').removeClass('active');
			newPlay.addClass('active');
			setVideoSrc(playIdToPlay[newPlay[0].id]);
			if(!userIsCoach){
				populateScoreSection(playIdToGrades[newPlay[0].id]);
			}
		}
	});
	$('.glyphicon-triangle-right').on('click', function(){
		var maxIndex = $('.play').length-1;
		var index = $('.play.active').index();
		if(index!=maxIndex){
			var newPlay = $('.play').eq(index+1);
			$('.play.active').removeClass('active');
			newPlay.addClass('active');
			setVideoSrc(playIdToPlay[newPlay[0].id]);
			if(!userIsCoach){
				populateScoreSection(playIdToGrades[newPlay[0].id]);
			}
		}
	});
	$(".submit-player-grade-btn .btn-custom").on('click', function(){
		var grades  = {};
		$('.position-trait').each(function(index){
			var score = $(this).find(".position-trait-score").html();
			if(parseInt(score)){
				var trait = $(this).find(".position-trait-text").html();
				grades[trait] = score;
			}
		});
		var playerList = positionToPlayerDict[$("#select-position")[0].selectedIndex];
		var player = playerList[$("#select-player")[0].selectedIndex-1];
		var playId = $('.play.active')[0].id;
		var gameId = playIdToPlay[$('.play.active')[0].id].gameId;
		var gradeParams = {
			gameId:gameId,
			playId:playId,
			grades:grades,
			playerId:player.playerId,
			positionId:player.positionId,
			teamId:player.teamId
		}
		$.post('/addGrade', gradeParams, function(response){
		});
		$('.grade-input-sctn').addClass('hidden');
		$("#select-player")[0].selectedIndex = 0;
	});
	$(".position-trait").on('click', function(e){
		var $activeTrait = $('.position-trait-active');
		var $newTrait = $(e.target).parent();
		$activeTrait.removeClass('position-trait-active');
		$newTrait.addClass('position-trait-active');
	});
	$("#select-position").change(function(e) {
		$("#select-player").empty();
		$("#select-player").append("<option></option>");
		var position = $("#select-position")[0].selectedIndex;
		var positionPlayers = [];
		if(positionToPlayerDict[position]){
			positionPlayers = positionToPlayerDict[position];
		}
		var option = '';
		for(var i=0;i<positionPlayers.length;i++){
			var positionPlayer = positionPlayers[i].name;
			option += '<option value="'+ positionPlayer + '">' + positionPlayer + '</option>';
		}
		$("#select-player").append(option);
		$('.select-player-sctn').removeClass('hidden');
		$('.grade-input-sctn').addClass('hidden');
		$('.no-trait-error').addClass('hidden');
	});
	$("#select-player").change(function(e) {
		$('.position-traits').empty();
		var categoryParams = {
			teamId:teamId,
			positionId:$("#select-position")[0].selectedIndex
		}
		$.post('/getCategoriesForPosition', categoryParams, function(response){
			var count = 0;
			   for(var trait in response){
				addPositionTraitEl(trait, (count==0));
				count++;
			   }
		   if(count > 0){
			   $('.grade-input-sctn').removeClass('hidden');
		   }
		   else{
			$('.no-trait-error').removeClass('hidden');
		   }
		});
	});
	$("#playForm").submit(function(e){
		e.preventDefault();
		var gameId = localStorage.gameId;
		for(var i =0; i<$("#videoUploadInput").prop('files').length;i++){
			var file = $("#videoUploadInput").prop('files')[i];
			uploadFile(gameId, file);
		}
	});
	function populateScoreSection(grades){
		var playScore = calcPlayScore(grades)
		$('.score-sctn').empty();
		addPlayScoreEl(playScore);
		for(grade in grades){
			addAttrEl(grades[grade], grade);
		}
	}
	function addPositionTraitEl(traitText, isActive){
		var divString = '<div></div>';
		var ulString = '<ul></ul>';
		var liString = '<li></li>';
		var li = $(liString);
		var positionTraitDiv = $(divString);
		var positionTraitClass = (isActive)?"position-trait position-trait-active":"position-trait";
		positionTraitDiv.addClass(positionTraitClass);
		var positionTraitScoreDiv = $(divString);
		positionTraitScoreDiv.html("--");
		positionTraitScoreDiv.addClass("position-trait-score");
		positionTraitTextDiv = $(divString);
		positionTraitTextDiv.html(traitText);
		positionTraitTextDiv.addClass("position-trait-text");
		positionTraitDiv.append(positionTraitScoreDiv);
		positionTraitDiv.append(positionTraitTextDiv);
		li.append(positionTraitDiv);
		$('.position-traits').append(li);
	}
	function addPlayScoreEl(playScore){
		var divString = '<div></div>';
		var ulString = '<ul></ul>';
		var liString = '<li></li>';
		var sectionDiv = $(divString);
		sectionDiv.addClass('play-score-sctn');
		var scoreDiv = $(divString);
		var scoreDivClassString = "";
		if(playScore < 40){
			scoreDivClassString = "play-score play-score-bad play-score-md";
		}
		else if(playScore < 70){
			scoreDivClassString = "play-score play-score-avg play-score-md";
		}
		else{
			scoreDivClassString = "play-score play-score-good play-score-md";
		}
		scoreDiv.addClass(scoreDivClassString);
		scoreDiv.html(playScore);
		sectionDiv.append(scoreDiv);
		$('.score-sctn').append(sectionDiv);
	}
	function addAttrEl(score, text){
		var divString = '<div></div>';
		var spanString = '<span></span>';
		var liString = '<li></li>';
		var sectionDiv = $(divString);
		sectionDiv.addClass("attr-score-sctn");
		var attrScoreDiv = $(divString);
		var playScoreClassString = "";
		if(score < 2){
			playScoreClassString = "attr-score play-score-bad";
		}
		else if(score < 4){
			playScoreClassString = "attr-score play-score-avg";
		}
		else{
			playScoreClassString = "attr-score play-score-good";
		}
		attrScoreDiv.addClass(playScoreClassString);
		addAttrScoreCss(attrScoreDiv, score);
		var attrTxtDiv = $(divString);
		attrTxtDiv.addClass('attr-text');
		var span = $(spanString);
		span.html(text);
		attrTxtDiv.append(span);
		sectionDiv.append(attrScoreDiv);
		sectionDiv.append(attrTxtDiv);
		$('.score-sctn').append(sectionDiv);
	}
	function addCoachPlayEl(id, title, isActive){
		var divString = '<div></div>';
		var ulString = '<ul></ul>';
		var liString = '<li></li>';
		var playDiv = $(divString);
		playDiv.attr('id', id);
		var classString = (isActive)?"active well play col-md-12":"well play col-md-12";
		playDiv.addClass(classString);
		var titleDiv = $(divString);
		titleDiv.addClass('play-title');
		titleDiv.html(title);
		playDiv.append(titleDiv);
		$(".play-select-sctn").append(playDiv);
	}
	function addPlayEl(playId, playScore,playTitle, isActive){
		var divString = '<div></div>';
		var ulString = '<ul></ul>';
		var liString = '<li></li>';
		var playDiv = $(divString);
		var playDivClass = (isActive)?"active well play col-md-12":"well play col-md-12"
		playDiv.addClass(playDivClass);
		playDiv.attr('id',playId);
		var ul = $(ulString);
		ul.addClass("play-list");
		var li1 = $(liString);
		var playScoreDiv = $(divString);
		var playScoreClassString = "";
		if(playScore < 40){
			playScoreClassString = "play-score play-score-bad play-score-sm";
		}
		else if(playScore < 70){
			playScoreClassString = "play-score play-score-avg play-score-sm";
		}
		else{
			playScoreClassString = "play-score play-score-good play-score-sm";
		}
		playScoreDiv.addClass(playScoreClassString);
		playScoreDiv.html(playScore);
		var li2 = $(liString);
		var playDdDiv = $(divString);
		playDdDiv.addClass("play-dd");
		playDdDiv.html(playTitle);
		li1.append(playScoreDiv);
		li2.append(playDdDiv);
		ul.append(li1);
		ul.append(li2);
		playDiv.append(ul);
		$(".play-select-sctn").append(playDiv);
	}
	function addAttrScoreCss(el, score){
		var height = 72;
		var frac = score/5;
		var elHeight = frac*height;
		var marginHeight = height-(frac*height);
		el.css({
			'margin-top': marginHeight,
			'height': elHeight
		});
	}
	function setVideoSrc(play){
		//get video url and set here
		var storageRef = firebase.storage().ref();
		var videoRef = storageRef.child('videos/'+ play.gameId+"/" + play.fileName).getDownloadURL().then(function(url) {
			$('.vid-player video source').attr('src', url);
			$(".vid-player video")[0].load();
		}).catch(function(error) {
		  // Handle any errors
		});
	}
	function uploadFile(gameId, file){
		// Create the file metadata
		var metadata = {
			contentType: file.type
		};
		// Create a root reference
		var storageRef = firebase.storage().ref();
		// Upload file and metadata to the object 'images/mountains.jpg'
		var uploadTask = storageRef.child('videos/'+ gameId+"/" + file.name).put(file, metadata);

		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
			function(snapshot) {
			// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ' + progress + '% done');
			switch (snapshot.state) {
			  case firebase.storage.TaskState.PAUSED: // or 'paused'
			  console.log('Upload is paused');
			  break;
			  case firebase.storage.TaskState.RUNNING: // or 'running'
			  console.log('Upload is running');
			  break;
			}
		}, function(error) {
			console.log(error.code);
		}, function() {
			// Upload completed successfully, now we can get the download URL
			var downloadURL = uploadTask.snapshot.downloadURL;
			var parameters = {
				gameId:gameId,
				fileName:file.name
			};
			$.post('/createPlay', parameters, function(response){
				playIdToPlay[response.playId] = response;
				addCoachPlayEl(response.playId,response.playTitle);
			});
		});
	}
}
else {
	window.location = '/';
}
	});
	});
