var form, firstName, lastName, emailAddress, petName, petType, date, hour, min, vet, service, confirmAvailability;
var inputGroupA;
var submitBtn;

window.addEventListener("load", start, false);

function start() {

	// Initialize all variables
  form = document.getElementById("form");
  firstName = document.getElementById("firstName");
  lastName = document.getElementById("lastName");
  emailAddress = document.getElementById("emailAddress");
  petName = document.getElementById("petName");
  date = document.getElementById("apptDate");
  hour = document.getElementById("apptHour");
  min = document.getElementById("apptMin");
  vet = document.getElementById("selectVet");
  service = document.getElementById("selectService");
  confirmAvailability = document.getElementById("confirmAvailability");
  submitBtn = document.getElementById("submitBtn");

  /* ADDITIONAL CONSTRAINTS */

  // Appointment Date is tomorrow at the earliest, 30 days away at the latest
  var minDate = new Date(new Date().getTime()+(24*60*60*1000)).toISOString().split('T')[0];
  date.setAttribute('min', minDate);

  var maxDate = new Date(new Date().getTime()+(30*24*60*60*1000)).toISOString().split('T')[0];
  date.setAttribute('max', maxDate);

  // If date is changed, check that it is not Sunday
  date.addEventListener('change', function() {

  	const day = (new Date(date.value)).getDay();

  	if (day == 6) { // Sunday
  		document.getElementById("dateInvalid").innerHTML = "We are not open on Sundays!";
  		date.classList.add("is-invalid");
  	} else if (day == 5) { // Saturday
  		
  		/* If it's Saturday, prevent user from selecting 5 pm or later */
  		document.getElementById("notForSat").disabled = true;
  		removeInvalid(date);

  	} else {
  		document.getElementById("notForSat").disabled = false;
  		removeInvalid(date);
  	}
  });


  /* OTHER LISTENERS */

  // IF "other" is selected in Pet Type, enable the specify box 
  other = document.getElementById("type6");
  other.addEventListener('change', function() {
  	var specifiedType = document.getElementById("typeOther");

  	if (other.checked) {
  			specifiedType.disabled = false;
  			specifiedType.focus();
  	} else {
  		 specifiedType.disabled = true;
  	}
  })

  // If an hour is selected/changed, show AM/PM
  hour.addEventListener('change', function() {

  	if (parseInt(hour.value) == 12 || parseInt(hour.value) < 10) {
  		document.getElementById("AMorPM").innerHTML = "PM";
  	} else {
  		document.getElementById("AMorPM").innerHTML = "AM";
  	}
  })

  // Add all input that can be automatically checked to an array
  inputGroupA = [firstName, lastName, emailAddress, petName, date, confirmAvailability];

  // If form is being submitted, validate all input first
  form.addEventListener('submit', function (event) {

  		/* Check if form is valid before submitting */
  		var isValid = validateForm();
        if (!isValid) { // if invalid, stop page from submitting form
          
          event.preventDefault();
          event.stopPropagation();
        } else {
        	sessionStorage.setItem('bookingNum', getRandomBookingNum());
			  	sessionStorage.setItem('firstName', firstName.value);
			  	sessionStorage.setItem('lastName', lastName.value);
			  	sessionStorage.setItem('petName', petName.value);
			  	sessionStorage.setItem('petType', petType.value);
			  	sessionStorage.setItem('date', date.value);
			  	sessionStorage.setItem('hour', hour.value);
			  	sessionStorage.setItem('min', min.value);
			  	sessionStorage.setItem('vet', vet.value);
			  	sessionStorage.setItem('service', service.value);
        }
        
    }, false);


}


function validateForm() {

	var allValid = true;
	var firstError;

	/* Check the input in the array */
	inputGroupA.forEach(function(input) {

		if (!input.checkValidity()) {
			allValid = false;
			input.classList.add("is-invalid");
			input.addEventListener("input", function(){removeInvalid(input);}, false);

			if (firstError == null) {
				firstError = input;
				input.focus();
			}
		} 
	});

	/* Check pet type */
	if (!validatePetType()) {
		allValid = false;
	}

	/* Check appt time */
	if (hour.value == "hh" || (hour.value == "5" && date.checkValidity() && (new Date(date.value)).getDay() == 5)) {
		allValid = false;
		hour.classList.add("is-invalid");
		hour.addEventListener("change", function(){removeInvalid(hour);}, false);
		if (firstError == null) {
			firstError = hour;
			hour.focus();
		}

	} 

	if (min.value == "mm") {
		allValid = false;
		min.classList.add("is-invalid");
		min.addEventListener("change", function(){removeInvalid(min);}, false);

		if (firstError == null) {
			firstError = min;
			min.focus();
		}
	}

	/* Check if veterinarian and service were selected */
	if (vet.value=="Select Veterinarian...") {
		allValid = false;
		vet.classList.add("is-invalid");
		vet.addEventListener("change", function(){removeInvalid(vet);}, false);

		if (firstError == null) {
			firstError = vet;
			vet.focus();
		}
	} 

	if (service.value=="Select Service...") {
		allValid = false;
		service.classList.add("is-invalid");
		service.addEventListener("change", function(){removeInvalid(service);}, false);
		
		if (firstError == null) {
			firstError = service;
			service.focus();
		}
	} 

	

	return allValid;
	
}

function validatePetType() {

	var types = document.querySelectorAll('input[name="petType"]');

	types.forEach(function(type) {

		if (type.checked) { // if a type has been selected, set pet type to that
			petType = type;
		}
	});

	if (petType == null) { // No pet type has been selected
			types.forEach(function(type) {
				type.classList.add("is-invalid");

				/* Add listeners that will remove invalid colouring if a type has been selected */
				type.addEventListener('change', function() {
					  types.forEach(function(typeA) {
					  	removeInvalid(typeA);
					  });
				});
				
			});

			return false;

	} else if (petType.value == "Other") { // Other has been selected
			var specifiedType = document.getElementById("typeOther");

			/* Check if the specify box is empty */
			if (specifiedType.value.trim()=="") {
				other.classList.add("is-invalid");
				specifiedType.addEventListener("input", function(){removeInvalid(other);}, false);
				return false;
			} else {
				petType = specifiedType;
				return true;
			}
	}

	// General case: a pet type has been selected/specified
	return true;

	
		

	
}

function removeInvalid(input) {
		input.classList.remove("is-invalid");
}

function getRandomBookingNum() {
	var string = "";
	for (let i = 0; i < 8; i++) {
		string += Math.floor(Math.random() * 10);
	}
	return string;
}


