function signOut() {
  firebase.auth().signOut().then(function() {
    window.location = "/";
  }).catch(function(error) {
    alert(error.message);
  });
}
$(document).ready(function(){
	firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
	setVideoSrc("https://firebasestorage.googleapis.com/v0/b/gamevue-c6394.appspot.com/o/videos%2F-KiGTKEA6mF0TYyRJ82S%2Fshe.mp4?alt=media&token=43558c7e-c2f4-4f3f-8eb5-f339b1edcdda");
	var $video  = $('video'),
		$vidContainer = $('.vid-player-sctn:first'),
		$leftSctn = $('.play-view-left-sctn'),
		$rightSctn = $('.play-view-right-sctn'),
		$window = $(window); 

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
	$(".submit-player-grade-btn .btn-custom").on('click', function(){
		console.log("push to server and refresh section");
	});
	$(".position-trait").on('click', function(e){
		var $activeTrait = $('.position-trait-active');
		var $newTrait = $(e.target).parent();
		$activeTrait.removeClass('position-trait-active');
		$newTrait.addClass('position-trait-active');
	});
	$("#select-position").change(function(e) {
		$('.select-player-sctn').removeClass('hidden');
	});
	$("#select-player").change(function(e) {
		$('.position-traits-sctn').removeClass('hidden');
		$('.score-buttons').removeClass('hidden');
	});
	$("#playForm").submit(function(e){
		e.preventDefault();
		addPlayEl(100, "", "");
		var gameId = 'game1';
		for(var i =0; i<$("#videoUploadInput").prop('files').length;i++){
			var file = $("#videoUploadInput").prop('files')[i];
			uploadFile(gameId, file);
		}
	});
	function addPlayEl(playScore, dAndD, description){
		var divString = '<div></div>';
		var ulString = '<ul></ul>';
		var liString = '<li></li>';
		var playDiv = $(divString);
		playDiv.addClass("well play col-md-12");
		var ul = $(ulString);
		ul.addClass("play-list");
		var li1 = $(liString);
		var playScoreDiv = $(divString);
		playScoreDiv.addClass("play-score play-score-avg play-score-sm");
		playScoreDiv.html(playScore);
		var li2 = $(liString);
		var playDdDiv = $(divString);
		playDdDiv.addClass("play-dd");
		playDdDiv.html(dAndD);
		var li3 = $(liString);
		var playResultDiv = $(divString);
		playResultDiv.addClass("play-result");
		playResultDiv.html(description);
		li1.append(playScoreDiv);
		li2.append(playDdDiv);
		li3.append(playResultDiv);
		ul.append(li1);
		ul.append(li2);
		ul.append(li3);
		playDiv.append(ul);
		$(".play-select-sctn").append(playDiv);
	}
	function setVideoSrc(videoUrl){
		$('.vid-player video source').attr('src', videoUrl);
		$(".vid-player video")[0].load();
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
				videoUrl:downloadURL
			};
			$.post('/createPlay', parameters, function(error){
				console.log(error);
			});
		});
	}
}
else {
	window.location = '/';
}
});
});