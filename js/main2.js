
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
	$("#book_appointment input").one("blur",function(){
		if ( !$(this).val() ) {
			$(this).after("<p class='warning'>Please enter a value.</p>");
		} else if ($(this).val().length > 0) {
			$("p").remove();
			$(this).off("blur");
		}
	});
	}

	function checkDate(){
		var today = new Date();
		var date = $("#date").val();

		$("#date").one("blur", function(){})


	}
	
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
