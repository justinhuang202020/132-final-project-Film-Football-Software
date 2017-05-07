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
      var user = firebase.auth().currentUser
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
    }); 
      $("#select-position").change(function(e) {
        console.log("getting categories");
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

