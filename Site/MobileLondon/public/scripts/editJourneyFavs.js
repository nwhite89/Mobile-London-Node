$(document).delegate('#editJourneys', 'pageshow', function () {
	editJourneys();
	$('a#clear').bind('tap', function () { 
		clearAll(); 
	});
	$('a#delete').bind('tap', function () { 
		editFavs(); 
	});
});

function editJourneys() {
	if (typeof(Storage)!=='undefined') {
	// User's device supports HTML5 Local Storage now test if they have any favourite Journeys
		if (localStorage.getItem('journeyPlanner')) {
			var journeys = JSON.parse(localStorage.getItem('journeyPlanner'));
			var buttons = '', editButtons = '';
			$.each(journeys, function (i, item) {
				var rel = item.from + "?" + item.to + "?" + item.fType + "?" + item.tType;
				buttons += '<input rel=\'' + rel + '\' type=\'checkbox\' name=\'' + item.from + "?" + item.to + '\' id=\'' + item.from + "?" + item.to + '\' rel=\'\'/><label style=\'white-space: normal;\' for=\'' + item.from + "?" + item.to + '\'>From: ' + item.from + " <br />To: " + item.to + '</label>';
			});
			$('div#editContent div fieldset').html('<div id=\'busFavs\' data-role=\'controlgroup\' data-ajax=\'false\'>' + buttons + '</div>').trigger('create');
		} else {
			$('a#edit').hide();
			$('div#favContent p').text('Sorry but no favourite journeys could be found.');
		}
	} else {
		$('a#edit').hide();
		$('div#favContent p').text('Apologies but it seems that your device dosn\'t support this feature.');
	}
};

function clearAll() {
	if (typeof(Storage)!=='undefined') {
		localStorage.clear('journeyPlanner');
		$('div#editContent').html('<p>Your favourites have been cleared.</p>');
		$('a#delete').hide().trigger('updatelayout');
		$('a#clear').hide().trigger('updatelayout');
	}
};

function editFavs() {
	var deleteJourney = $('fieldset div input');
	check = 0;
	jsonJourneys = new Array();
	// Check all of the journeys the user wants to delete
	$.each(deleteJourney, function (i, item) {
		if (!$(this).next().hasClass('ui-checkbox-on')) { 
			//alert($(this).attr('rel'));
			var newFav = $(this).attr('rel').split('?');
			jsonJourneys.push({'from': newFav[0], 'to': newFav[1], 'fType': newFav[2], 'tType': newFav[3]});
			check++;
		}
	});
	localStorage.setItem('journeyPlanner', '');
	if (check != 0) { localStorage.setItem('journeyPlanner', JSON.stringify(jsonJourneys)); }
	window.location = "/favs/journeys";
};