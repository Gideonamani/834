var $grid = $('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth: 300,
  stagger: 30,
  gutter: 8,
  isFitWidth: true
});

$('.subject-meta').hide();
$grid.masonry()


Date.prototype.getWeek = function () {
    var target  = new Date(this.valueOf());
    var dayNr   = (this.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
}

var d= new Date();
// var d = new Date(2016, 8, 24, 1, 10);

var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";


var monthName = new Array(12);
monthName[0]=  "January";
monthName[1] = "February";
monthName[2] = "March";
monthName[3] = "April";
monthName[4] = "May";
monthName[5] = "June";
monthName[6] = "July";
monthName[7] = "August";
monthName[8] = "September";
monthName[9] = "October";
monthName[10] = "November";
monthName[11] = "December";


$('.todays-classes h3 #day').text(weekday[d.getDay()] + ', ' + monthName[d.getMonth()] + ' ' + d.getDate());


$(document).ready(function(){

  $.getJSON( "UniSem07Timetable.json", function( data ) {
    var items = [];
    var weekNumber;

    if (d.getWeek()%2 == 0){
      weekNumber = "SecondWeek";
    }else if (d.getWeek()%2 == 1){
      weekNumber = "FirstWeek";
    }


    TodaysSubjects = data[weekNumber][weekday[d.getDay()]];

    if (TodaysSubjects.length > 0) {
      //if it is not a free day then write out the classes were having
      for (var i = 0; i < TodaysSubjects.length; i++) {
        var Subject = TodaysSubjects[i];
        var SubjectName = TodaysSubjects[i][0];
        var SubjectTeacher = TodaysSubjects[i][1];
        var SubjectClassroom = TodaysSubjects[i][2];

        if (SubjectTeacher == "") {SubjectTeacher = "Нейзвестный";}
        if (SubjectClassroom == "") {SubjectClassroom = "Нейзвестный";}

        if (!SubjectName == "") {        
          items.push(
            "<li class='somo-la-leo'>"+
              // " Subject: " + TodaysSubjects[i][0] + ", " +
              "<p class='kuhusu-somo'>" + " Предмет: "+"<span class='bolder somo'>" + SubjectName +"</span>" + ", " + "</p>" + 
              // " Teacher: " + TodaysSubjects[i][1] + ", " +
              "<p class='kuhusu-somo'>" + " Преподаватель: "+"<span class='bolder mwalimu'>" + SubjectTeacher +"</span>" + ", " + "</p>" +
              // " Where: " + TodaysSubjects[i][2] + "." +
              "<p class='kuhusu-somo'>" + " Аудитория: "+"<span class='bolder darasa'>" + SubjectClassroom +"</span>" + "." + "</p>" +
            "</li>"
            ); 
        }else{ 
          items.push("<li class='somo-la-leo free-para'> Free to Party !!! </li>");
        }        
      }


      $("div.todays-classes div.todays-classes-2").append("<h4>Today's classes are: </h4>");
      $( "<ol/>", {
          "class": "todays-subjects",
          html: items.join( "" )
        }).appendTo( "div.todays-classes div.todays-classes-2" );
    }else{
      if(weekday[d.getDay()] == "Saturday"){
        //if the day is a free one and it is a saturday
        $( "<h4/>", {
            "class": "rest-saturday",
            text: "Supercool that there are no classes today. Enjoy resposibly."
          }).appendTo( "div.todays-classes div.todays-classes-2" );
        $('div.row.todays-classes').addClass("saturday");

      }
      else if(weekday[d.getDay()] == "Sunday"){
        //if the day is a free one and it is a SUNDAY
        $( "<h4/>", {
            "class": "rest-sunday",
            text: "You just need to relax and take it easy."
          }).appendTo( "div.todays-classes div.todays-classes-2" );
        $('div .row.todays-classes').addClass("sunday");

      }else{
        $( "<h4/>", {
          "class": "rest-weekday",
           text: "Today is a day to sleep."  
        }).appendTo( "div.todays-classes div.todays-classes-2" );
      }
    }

  });


  //Put the current year on the copyright at the bottom of the page.
  $('.cprt-year #current-year').text(d.getFullYear());

  // The flip clock plugin for an awesome countdown timer.
     var clocks = [];

      // Grab the current date
      var currentDate = new Date();

      // Set some date in the future. In this case, it's always Jan 1
      var futureDate  = new Date(currentDate.getFullYear()+1, 0, 1, 1, 0);

      // Calculate the difference in seconds between the future and current date
      var diff = futureDate.getTime() / 1000 - currentDate.getTime() / 1000;

      // Instantiate a coutdown FlipClock
      clocks.push($('.clock0').FlipClock(diff, {
        clockFace: 'DailyCounter',
        countdown: true,
        showDays: false
      }));

      clock1 = $('.clock1').FlipClock({
            clockFace: 'DailyCounter',
            autoStart: false,
            callbacks: {
              stop: function() {
                $('.message').html('The clock has stopped!')
              }
            }
        });
            
        clock1.setTime(220880);
        clock1.setCountdown(true);
        clock1.start();
        clocks.push(clock1);



  //Form submission of classes VALIDATION
  $('#modal-classinput-submit').on('click', function(){
    $("#fillthesheet").trigger("submit");
  });

  $( "#fillthesheet" ).submit(function( event ) {
    event.preventDefault();
    
    var showConfirmation = function (data){
      $('#confirming').fadeIn(320).delay(400).fadeOut(400);
      $("#fillthesheet").trigger('reset')
    }

    var showRemorse = function (data){
      $('#remorse').fadeIn(320).delay(400).fadeOut(300);
    }

    var scriptUrl = "https://script.google.com/macros/s/AKfycbwPgBS7SbZZMlj2IVps_eXlPM1YDJkOKqUfsii7GPC1SgzIZ_Q/exec";
    scriptUrl += '?' + $.param({
      'Subject': $('#Subject').val(),
      'Class Number': $('#ClassNo').val(),
      'Date': new Date(),
      'Uploader': Math.floor(Math.random() * 17),   //Change this later
      'Link DOC': $('#DOCFileInput').val(),
      'Link MD': $('#MDFileInput').val(),
      'Link PDF': $('#PDFFileInput').val(),
      'Link AUDIO': $('#AudioFileInput').val(),
      'Link VIDEO': $('#VideoFileInput').val()
    });
    
    $.ajax({
      crossDomain: true,
      url: scriptUrl,
      method: "POST",
      dataType: "jsonp",
      success: showConfirmation,
      error: showRemorse
    });
  });

});



// Mabina Auth procedures
function onyeshamabina (profile) {
  $('span#not-inside').hide();
  $('span#inside-app').show();

  function titleCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  document.getElementById('avatar').src = profile.picture;
  document.getElementById('namemabina').textContent = titleCase(profile.name);
}

function showClassInput() {
  $('#mabina-class-input').show();
  $('.subject-meta').show();
  $grid.masonry();
}

function removeClassInput() {
  $('#mabina-class-input').hide();
  $('.subject-meta').hide();
  $grid.masonry();
}


// Service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

// Push notification subscription setup
navigator.serviceWorker && navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {  
  serviceWorkerRegistration.pushManager.getSubscription()  
    .then(function(subscription) {  
      // subscription will be null or a PushSubscription
      if (subscription) {
        console.info('Got existing', subscription);
        return;  // got one, yay
      }
      serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
        .then(function(subscription) { 
          console.info('Newly subscribed to push!', subscription);
        });
    });
});