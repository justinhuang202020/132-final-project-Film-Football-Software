$(document).ready(function(){
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

    console.log();
		console.log(traitText + " " + traitImportance + " " + option) ;
    const parameters = {
      position: option,
      importance: traitImportance, 
      category: traitText
    }
    $.post('/createField', parameters, function (error){
      if (error ===false ) {

      }
	});
});

$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});

// chart 

google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'Game');
      data.addColumn('number', 'Overall Score');

      data.addRows([
        [1, 5],   [2, 10],  [3, 23],  [4, 17],  [5, 18]
      ]);

      var options = {
        title: 'Last Five Games',
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
          title: 'Game',
          baselineColor: 'white',
          gridlines: {count: 0},
          titleTextStyle: { color: 'white' }, 
          textStyle: {
            color: 'white'
            // fontName: 'Myriad'
          }, 
          ticks: [1, 2, 3, 4, 5]
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

$(window).resize(function(){
  drawBasic();
});

