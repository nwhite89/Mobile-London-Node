function postCodeCheck(pC) {
	var pCRegEx = /^([a-zA-Z]){1}([0-9][0-9]|[0-9]|[a-zA-Z][0-9][a-zA-Z]|[a-zA-Z][0-9][0-9]|[a-zA-Z][0-9]){1}([ ])([0-9][a-zA-z][a-zA-z]){1}$/;;
	return pCRegEx.test(pC);
};
$(document).delegate('#form', 'pagecreate', function () {
	findMe();
	$('a#findMe').bind('tap', function () {
		$('form#geoForm').submit();
	});
	$('form#pcForm').submit(function () {
		if (postCodeCheck($('input#postCode').val()) == true) {
		} else {
			$('input#postCode').attr('style', 'border: 2px solid #FF0000;');
			$('label#postCode').text('Postcode: *please enter a valid Postcode');
			return false;
		}
	});
	$('form#geoForm').submit(function () {
		if ($('input#geoLng').val() == '' || $('input#geoLat').val() == '') {
			$('span#geoError').text("Sorry we where unable to find your location please try our Postcode option.");
			return false;
		} else { return true; }
	});
});
