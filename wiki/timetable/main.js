
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


var d = new Date();

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


$(document).ready(function(){
  //Populate the classes fields
  $.getJSON( "../UniSem07Timetable.json", fillInTheTimetable);

  function fillInTheTimetable ( data ) {
    var items = [];

    var weekNumber = giveWeekNumber(d);

    for (var dayOfTheWeek = 1; dayOfTheWeek < 7; dayOfTheWeek++) {

      function addDoubleDiv () {
        var theMonday = new Date(d.getTime() - (d.getDay() - 1) * 24 * 60 * 60 * 1000);
        var currentDate = new Date(theMonday.getTime() + (dayOfTheWeek-1) * 24 * 60 * 60 * 1000);
        metaForTheDaysClasses(currentDate, dayOfTheWeek, weekNumber, '#timetable-app');
      }

      var TodaysSubjects = data[weekNumber][weekday[dayOfTheWeek]];

      if (TodaysSubjects.length > 0) {
        //if it is not a free day then write out the classes we are having
        for (var i = 0; i < TodaysSubjects.length; i++) {
          var Subject = TodaysSubjects[i];
          var SubjectName = TodaysSubjects[i][0];
          var SubjectTeacher = TodaysSubjects[i][1];
          var SubjectClassroom = TodaysSubjects[i][2];

          if (SubjectTeacher == "") {SubjectTeacher = "Нейзвестный";}
          if (SubjectClassroom == "") {SubjectClassroom = "Нейзвестный";}

          if (!SubjectName == "") { 
            if(i===0){items[dayOfTheWeek] = [];}       
            items[dayOfTheWeek].push(
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
            items[dayOfTheWeek].push("<li class='somo-la-leo free-para'> Free to Party !!! </li>");
          }        
        }

          //Append the html and class details for similar stylings like in the wiki
          addDoubleDiv ();
          $("div.todays-classes div.todays-classes-2:last").append('<h4>This day'+ "'" + 's classes are: </h4>')

        $( "<ol/>", {
            "class": "todays-subjects",
            html: items[dayOfTheWeek].join( "" ),
          }).appendTo( "div.todays-classes div.todays-classes-2:last" );
        $('div.row.todays-classes:last').slideDown(1800);
      }
      else{
        if(weekday[dayOfTheWeek] == "Saturday"){
          //if the day is a free one and it is a saturday
          addDoubleDiv ();
          $( "<h4/>", {
              "class": "rest-saturday",
              text: "Supercool that there are no classes today. Enjoy resposibly."
            }).appendTo( "div.todays-classes div.todays-classes-2:last" );
          $('div.row.todays-classes:last').addClass("saturday").slideDown(100);

        }
        else{
          addDoubleDiv ();
          $( "<h4/>", {
            "class": "rest-weekday",
             text: "Today is a day to sleep."  
          }).appendTo( "div.todays-classes div.todays-classes-2:last" );
          $('div .row.todays-classes:last').addClass("freeday").slideDown(100);
        }
      }
    }

        //special case for sunday

        var theMonday = new Date(d.getTime() - (d.getDay() - 1) * 24 * 60 * 60 * 1000);
        var currentDate = new Date(theMonday.getTime() + (7-1) * 24 * 60 * 60 * 1000);
        metaForTheDaysClasses(currentDate, 0, weekNumber, '#timetable-app');
       
        $( "<h4/>", {
            "class": "rest-sunday",
            text: "You just need to relax and take it easy."
          }).appendTo( "div.todays-classes div.todays-classes-2:last" );
          $('div .row.todays-classes:last').addClass("sunday").slideDown(100);


  }
      
      $('.input-group.date').datepicker({
        format: "dd/mm/yyyy",
        startDate: "01-09-2016",
        endDate: "31-12-2016",
          maxViewMode: 1,
          clearBtn: true,
          autoclose: true,
          todayHighlight: true,
          weekStart: 1,
          daysOfWeekHighlighted: "0,6",
          // calendarWeeks: true

      });

      $( "#go-to-date-btn" ).click(function() {
        var gtd = $( "#go-to-date" );
          if (gtd.val() != "") {
            gtdDateArray = gtd.val().split('/');
            var dd = gtdDateArray[0];
            var mm = gtdDateArray[1] - 1;
            var yy = gtdDateArray[2];
            gtdDate = new Date(yy, mm, dd);

            var weekNumber = giveWeekNumber(gtdDate);

            // A quick hack that I'd like to fix later.
            if (gtdDate.getDay() === 0) {
              if (gtdDate.getWeek()%2 == 0){
                weekNumber = "SecondWeek";
              }else if (gtdDate.getWeek()%2 == 1){
                weekNumber = "FirstWeek";
              }
            }

            var dayOfTheWeek = gtdDate.getDay();
            metaForTheDaysClasses(gtdDate, dayOfTheWeek, weekNumber, '#go-to-date-div .row2', 'removeIcon');
            
            $.getJSON( "UniSem07Timetable.json", getDaysTimetable);

            function getDaysTimetable(data){

              var items = [];

              var TodaysSubjects = data[weekNumber][weekday[dayOfTheWeek]];
              classLogic (TodaysSubjects, "div.todays-classes div.todays-classes-2:last", items, dayOfTheWeek );
            }

          }
      });
      
      //Remove the grand-parent when the remove icon is clicked....
      // Update it to even remove it completely from the DOM
      $("#go-to-date-div").on( "click", ".rt .glyphicon-remove", function() {
          $( this ).parent().parent().parent().slideUp( 300 );
      });


      //Put the current year on the copyright at the bottom of the page.
      $('.cprt-year #current-year').text(d.getFullYear());
});


function metaForTheDaysClasses (date, dayN, weeknumber, domPlacement, removeIcon){
  var l1 = '<div class="row todays-classes no-display"><div class="col-md-10 col-md-offset-1 todays-classes-2">';
  var l2 = '';
  var l3 = '<h3>This is a <span class="day">' + weekday[dayN] + '</span>' + ' of the ' + weeknumber + ' </h3>';
  var l4 = '<h3>' + monthName[date.getMonth()] + ', ' + date.getDate() + '</h3>' + '</div> </div>';

  if (arguments[4] == 'removeIcon' ) {
    var l2 = '<div class="rt"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div>';
  }

  $(domPlacement).append( l1 + l2 + l3 + l4 );
}


function giveWeekNumber (d) {
    var weekNumber;
    if (d.getDay() != 0) {
      if (d.getWeek()%2 == 0){
        weekNumber = "SecondWeek";
      }else if (d.getWeek()%2 == 1){
        weekNumber = "FirstWeek";
      }     
    }else{
      if (d.getWeek()%2 == 0){
        weekNumber = "FirstWeek";
      }else if (d.getWeek()%2 == 1){
        weekNumber = "SecondWeek";
      }
    }
    return weekNumber;
}

function classLogic (TodaysSubjects, domPlacement, items, dayOfTheWeek) {

  function addDDLogic(){
    if (arguments[4] == 'addDD') {
      addDoubleDiv();
    }
  }

  if (TodaysSubjects.length > 0) {
        //if it is not a free day then write out the classes we are having
        for (var i = 0; i < TodaysSubjects.length; i++) {
          var Subject = TodaysSubjects[i];
          var SubjectName = TodaysSubjects[i][0];
          var SubjectTeacher = TodaysSubjects[i][1];
          var SubjectClassroom = TodaysSubjects[i][2];

          if (SubjectTeacher == "") {SubjectTeacher = "Нейзвестный";}
          if (SubjectClassroom == "") {SubjectClassroom = "Нейзвестный";}

          if (!SubjectName == "") { 
            if(i===0){items[dayOfTheWeek] = [];}       
            items[dayOfTheWeek].push(
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
            items[dayOfTheWeek].push("<li class='somo-la-leo free-para'> Free to Party !!! </li>");
          }        
        }

          //Append the html and class details for similar stylings like in the wiki
          addDDLogic();
          $(domPlacement).append('<h4>This day'+ "'" + 's classes are: </h4>');
        $( "<ol/>", {
            "class": "todays-subjects",
            html: items[dayOfTheWeek].join( "" ),
          }).appendTo( domPlacement );
        $('div.row.todays-classes:last').slideDown( 250 );

      }
      else{
        if(weekday[dayOfTheWeek] == "Saturday"){
          //if the day is a free one and it is a saturday
          addDDLogic();
          $( "<h4/>", {
              "class": "rest-saturday",
              text: "Supercool that there are no classes today. Enjoy resposibly."
            }).appendTo( domPlacement );
          $('div.row.todays-classes:last').addClass("saturday").slideDown( 250 );

        }
        else if (weekday[dayOfTheWeek] == "Sunday"){
          $( "<h4/>", {
            "class": "rest-sunday",
            text: "You just need to relax and take it easy."
          }).appendTo( "div.todays-classes div.todays-classes-2:last" );
          $('div .row.todays-classes:last').addClass("sunday").slideDown( 250 );
        }
        else{
          addDDLogic();
          $( "<h4/>", {
            "class": "rest-weekday",
             text: "Today is a day to sleep."  
          }).appendTo( domPlacement );
          $('div .row.todays-classes:last').addClass("freeday").slideDown( 250 );
        }
      }
}



// metaForTheDaysClasses(currentDate, dayOfTheWeek, weekNumber, '#timetable-app');


// $('#timetable-app').append('<div class="row todays-classes"><div class="col-md-10 col-md-offset-1 todays-classes-2">' +
//                   '<h3>This is a <span class="day">' + weekday[dayOfTheWeek] + '</span>' + ' of the ' + weekNumber + ' </h3>' +
//                   '<h3>' + monthName[currentDate.getMonth()] + ', ' + currentDate.getDate() + '</h3>' +
//                 '</div> </div>');