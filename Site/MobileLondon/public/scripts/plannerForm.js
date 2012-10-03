$(document).delegate('#plannerForm', 'pageshow', function () {
	$('form#planner').submit(function() {
		var userSpecTime = $('input#time').val()
			,	userSpecDate = $('input#date').val()
			,	fromInput = $('input#from').val().replace(/ /gi,'').toLowerCase()
			,	fromChoice = $('select#fromChoice').val()
			,	toInput = $('input#to').val().replace(/ /gi,'').toLowerCase()
			,	toChoice = $('select#toChoice').val()
			;
		
		if (fromChoice == 'coord' && toChoice == 'coord') {
			scrollTo(0,0);
			$('input#from').prev().find('span').html(' *sorry but you can not set Current Location for to and from');
			$('input#from').attr('style', 'border: 2px solid #FF0000;');
			$('input#to').prev().find('span').html(' *sorry but you can not set Current Location for to and from');
			$('input#to').attr('style', 'border: 2px solid #FF0000;');
			return false;
		} else if (fromInput == toInput) {
			$('input#from').prev().find('span').html(' *sorry but you can not set to and from as the same');
			$('input#from').attr('style', 'border: 2px solid #FF0000;');
			$('input#to').prev().find('span').html(' *sorry but you can not set to and from as the same');
			$('input#to').attr('style', 'border: 2px solid #FF0000;');
			return false;
		} else if(fromToTest(fromInput, fromChoice, $('input#from')) && fromToTest(toInput, toChoice, $('input#to'))) {
			return true;
		} else {
			return false;
		}
	});
	geo();
	$('input#to').blur(function () {
		var value = $(this).val();
		if (postCodeCheck(value.replace(/ /gi,'').toLowerCase())) {
			$(this).val(value.toUpperCase());
			$("select[id$='toChoice'] option[value='locator']").attr("selected","selected");
			$('select#toChoice').selectmenu('refresh', true);
		}
	});
	$('input#from').blur(function () {
		var value = $(this).val();
		if (postCodeCheck(value.replace(/ /gi,'').toLowerCase())) {
			$(this).val(value.toUpperCase());
			$("select[id$='fromChoice'] option[value='locator']").attr("selected","selected");
			$('select#fromChoice').selectmenu('refresh', true);
		}
	});

});
function postCodeCheck(pC) {
	var pCRegEx = /^([a-zA-Z]){1}([0-9][0-9]|[0-9]|[a-zA-Z][0-9][a-zA-Z]|[a-zA-Z][0-9][0-9]|[a-zA-Z][0-9])([0-9][a-zA-z][a-zA-z]){1}$/;;
	return pCRegEx.test(pC);
};
function fromToTest(input, choice, field) {
	if (choice == 'coord') {
		if ($('input#geo').val() == '') {
			field.prev().find('span').html(' *sorry but your location could not be found');
			field.attr('style', 'border: 2px solid #FF0000;');
			return false;
		} else {
			return true;
		}
	} else if (input == '') {
		scrollTo(0,0);
		field.prev().find('span').html(' *sorry but you have not entered location');
		field.attr('style', 'border: 2px solid #FF0000;');
		return false;
	} else if (choice == 'locator') {
		if (postCodeCheck(input)) {
			return true;
		} else {
			scrollTo(0,0);
			field.prev().find('span').html(' *please enter a valid Postcode');
			field.attr('style', 'border: 2px solid #FF0000;');
			return false;
		}
	} else {
		return true;
	}
};

function geo() {
	navigator.geolocation.getCurrentPosition(function(position) {
		var geoAcc = position.coords.accuracy;
		$('input#geo').val(position.coords.longitude + ':' + position.coords.latitude);
	});
}