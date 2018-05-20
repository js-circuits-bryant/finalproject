
// slideToggle the grooming descriptions
$(".serviceDesc").hide();
$(".fa-question-circle").on("click", function(){
	$(this).closest("td").find(".serviceDesc").slideToggle();
});

// show/hide form & confirmations
$(".view-appts").on("click", function(){
	$(this).text($(this).text() == 'View Appointments' ? 'Close Appointments' : 'View Appointments');
	$("#book_appointment").toggle("slow", function(){
		$("#confirmation").toggle("slow", function(){
		});
});
});

//scrolling script
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });

 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCKLzIEjdHd-VxmAaOeJWDr75iKI642fL8",
    authDomain: "grooming-appts.firebaseapp.com",
    databaseURL: "https://grooming-appts.firebaseio.com",
    projectId: "grooming-appts",
    storageBucket: "grooming-appts.appspot.com",
    messagingSenderId: "481931624356"
  };
  firebase.initializeApp(config);

  // Connect to Database
  var database = firebase.database();

  // reservation Object
  var reservationData = {};



//submit form & post to firebase
$(".submitAppt").on("click", function(){

	//create a section for reservations database
	var reservationsReference = database.ref('appointments');

	//get Petname
	reservationData.petName = $("#petName").val();
	//get email
	reservationData.email = $("#email").val();
 	//get Date
 	reservationData.date = $("#date").val();
	//get Time
	 reservationData.time = $("#time :selected").text();
	// get grooming Service
	var groomingValues = [];
	var groomingValue = groomingValues.join(', ');
	reservationData.groomingType = groomingValue;
	$("input[name=groomingType]:checked").map(function(){
	groomingValues.push($(this).val()); 
		});
// send data to firebase
	reservationsReference.push(reservationData);
// submit the form
	$("#book_appointment").submit(function(e){
		e.preventDefault();
		$("#book_appointment").hide();
		$("#confirmation").show();

	});	

});
// validate before submitting
function validate(){
	// validate name &  email
	
	function checkInputs(){
	$("#petName, #email").on("blur",function(){
		if ( !$(this).val() ) {
			$(this).after("<p class='warning'>Please enter a value.</p>");
		} 
		else if ($(this).val().length > 0){
			$(this).next("p").remove();
		}
	});
	}
	// validate date
	function checkDate(){
		var current = new Date();
		var today = current.toString('mm/dd/yyyy');
		var date = $("#date").val();


		$("input#date").one("blur", function(){

			if (date < today){
				$("#date").after("<p class='warning'>Please enter a valid date</p>");		
			} 

			else if (date > today){
				$("#date").remove();
			}

		});
	}

	//grooming check
	function checkGroom(){
		var serviceType = $("input[name=groomingType]");
		var date = $("#date");

		$(date).on("blur", function(){
			if($(serviceType).is(':checked')){
			    $("#grooming-type td").find("p").remove();
			}
			else $(serviceType).after("<p class='warning'>Please select a service</p>");

		});

	}
	
	checkInputs();
	checkDate();
	checkGroom();
}

//listen for any changes to data

function getReservations(){
	database.ref("appointments").on("value", function(results){
		//get all appointments stored in results on firebase
		var allReservations = results.val();
		// empty entries from DOM before appending appts
		$(".appointments").empty();

		for(var reservation in allReservations){
			var context = {
				petName: allReservations[reservation].petName,
				email: allReservations[reservation].email,
				groomingType: allReservations[reservation].groomingType,
				date: allReservations[reservation].date,
				time: allReservations[reservation].time,
				reservationId: reservation
			};

			// handlebars template
			var source = $("#appointment-template").html();
			var template = Handlebars.compile(source);
			var appointmentItem = template(context);
			$(".appointments").append(appointmentItem);

			//filter confirmation to user
			
		}
	});
}

// google maps
function initMap(){
//map styles array
var styles = [
{ stylers: [
	{hue: '#eee'},
	{saturation: -10}
	]
}, {
	featureType:'road',
	elementType: 'geometry',
	stylers: [
	{lightness: 100},
	{visibility: 'simplified'},
	{color:'#000'}
	]
}];

var map = new google.maps.Map(document.getElementById('map'), {
	center: {lat:40.8054491, lng:-73.9654415},
	zoom: 18,
	streetViewControl: true,
	styles: styles
});

var marker = new google.maps.Marker({
	position: {lat:40.8054491, lng:-73.9654415},
	map:map
});

}


getReservations();
validate();
