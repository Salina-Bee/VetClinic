window.addEventListener("load", start, false);

function start() {
	var bookingNum = sessionStorage.getItem('bookingNum');
	var firstName = sessionStorage.getItem('firstName');
	var lastName = sessionStorage.getItem('lastName');
	var petName = sessionStorage.getItem('petName');
	var petType = sessionStorage.getItem('petType');
	var date = new Date(sessionStorage.getItem('date'));
	var time = sessionStorage.getItem('hour') + ":" + sessionStorage.getItem('min');
	var vet = sessionStorage.getItem('vet');
	var service = sessionStorage.getItem('service');

	document.getElementById("bookingNum").innerHTML = bookingNum;
	document.getElementById("name").innerHTML = firstName + " " + lastName;
	document.getElementById("pet").innerHTML = petName + " (" + petType + ")";
	document.getElementById("apptInfo").innerHTML = date.toLocaleDateString("en-US", {day:'numeric'}) + "-" 
		+ date.toLocaleDateString("en-US", {month:'short'}) + "-" 
		+ date.toLocaleDateString("en-US", {year:'numeric'}) + "; " 
		+ time;

	if (parseInt(time) == 12 || parseInt(time) < 10) {
		document.getElementById("apptInfo").innerHTML += " PM";
	} else {
		document.getElementById("apptInfo").innerHTML += " AM";
	}

	document.getElementById("vet").innerHTML = vet;
	document.getElementById("service").innerHTML = service;

}



