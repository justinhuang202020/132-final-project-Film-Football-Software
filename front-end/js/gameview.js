$(document).ready(function(){
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
});